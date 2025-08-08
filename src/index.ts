#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import ignore from 'ignore'
import { getEncoding } from 'js-tiktoken'
import { BASE_IGNORE_PATTERNS, EXCLUDABLE_EXTENSIONS } from './excludes.js'
import type { FileStats, CliArgs } from './types.js'
import { formatNumber, formatBytes, isBinary, errorMessage } from './utils.js'
import { getModelPricing, formatModelList, DEFAULT_MODEL } from './pricing.js'

const encoding = getEncoding('o200k_base')

const HELP = `
codemass - Weigh your code in tokens ⚖️

USAGE:
  npx codemass [path] [options]
  
OPTIONS:
  -h, --help         Show this help message
  --exclude <exts>   Exclude specific extensions (comma-separated)
  --no-json          Exclude JSON files
  --no-markdown      Exclude Markdown files  
  --no-yaml          Exclude YAML files
  --model <id>       Choose LLM model for pricing (default: ${DEFAULT_MODEL})
  --list-models      List available models and pricing
  
ARGUMENTS:
  path               Directory to analyze (default: current directory)

EXAMPLES:
  npx codemass                        # All text files with default model
  npx codemass --model gpt-4o         # Use GPT-4o pricing
  npx codemass --no-json --no-yaml    # Exclude JSON and YAML
  npx codemass --exclude .test.js     # Exclude test files
  npx codemass --list-models          # Show all available models

Note: Counts all non-binary text files by default.
      Always respects .gitignore patterns.
      Token count uses OpenAI's o200k_base tokenizer.
`

function loadIgnorePatterns(dir: string) {
  let ig = ignore().add(BASE_IGNORE_PATTERNS)
  // Always use .gitignore if it exists
  let gitignorePath = join(dir, '.gitignore')
  if (existsSync(gitignorePath)) {
    ig.add(readFileSync(gitignorePath, 'utf-8'))
  }
  return ig
}

function getExcludePatterns(args: CliArgs): {
  extensions: Set<string>
  patterns: string[]
} {
  let extensions = new Set<string>()
  let patterns: string[] = []

  // Add excluded extensions/patterns from CLI
  if (args.exclude) {
    args.exclude.forEach((item: string) => {
      if (
        item.includes('*') ||
        item.includes('.test.') ||
        item.includes('.spec.')
      ) {
        patterns.push(item)
      } else {
        extensions.add(item.startsWith('.') ? item : '.' + item)
      }
    })
  }

  // Exclude based on flags
  if (args.noJson) {
    EXCLUDABLE_EXTENSIONS.json.forEach((ext) => extensions.add(ext))
  }

  if (args.noMarkdown) {
    EXCLUDABLE_EXTENSIONS.markdown.forEach((ext) => extensions.add(ext))
  }

  if (args.noYaml) {
    EXCLUDABLE_EXTENSIONS.yaml.forEach((ext) => extensions.add(ext))
  }

  return { extensions, patterns }
}

export function countTokens(filePath: string): number {
  try {
    let content = readFileSync(filePath, 'utf-8')
    return encoding.encode(content).length
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return 0
  }
}

function scanFiles(
  dir: string,
  baseDir = dir,
  ig?: ReturnType<typeof ignore>,
  excludeInfo?: { extensions: Set<string>; patterns: string[] }
): FileStats[] {
  if (!ig) ig = loadIgnorePatterns(baseDir)
  if (!excludeInfo) excludeInfo = { extensions: new Set(), patterns: [] }

  let results: FileStats[] = []

  let files: string[]
  try {
    files = readdirSync(dir)
  } catch (error: any) {
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      console.error(
        errorMessage(
          `Error: Permission denied accessing ${relative(baseDir, dir)}`
        )
      )
      process.exit(1)
    }
    throw error
  }

  for (let file of files) {
    let filePath = join(dir, file)
    let relativePath = relative(baseDir, filePath)

    if (ig.ignores(relativePath)) continue

    let stat = statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...scanFiles(filePath, baseDir, ig, excludeInfo))
    } else {
      const ext = extname(filePath).toLowerCase()
      const filename = file.toLowerCase()

      // Skip if extension is excluded
      if (excludeInfo.extensions.has(ext)) continue

      // Skip if matches any exclude pattern
      const matchesPattern = excludeInfo.patterns.some((pattern) => {
        if (pattern.includes('.test.') && filename.includes('.test.'))
          return true
        if (pattern.includes('.spec.') && filename.includes('.spec.'))
          return true
        return false
      })
      if (matchesPattern) continue

      // Skip binary files
      if (isBinary(filePath)) continue

      // Count tokens for all text files
      let tokens = countTokens(filePath)
      if (tokens > 0) {
        results.push({ path: relativePath, tokens, size: stat.size })
      }
    }
  }

  return results
}

// Parse CLI arguments
function parseArgs(): CliArgs {
  let args = process.argv.slice(2)
  let result: CliArgs = {}

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
      result.help = true
    } else if (args[i] === '--exclude' && i + 1 < args.length) {
      result.exclude = args[++i].split(',')
    } else if (args[i] === '--no-json') {
      result.noJson = true
    } else if (args[i] === '--no-markdown' || args[i] === '--no-md') {
      result.noMarkdown = true
    } else if (args[i] === '--no-yaml') {
      result.noYaml = true
    } else if (args[i] === '--model' && i + 1 < args.length) {
      result.model = args[++i]
    } else if (args[i] === '--list-models') {
      result.listModels = true
    } else if (!result.path && !args[i].startsWith('-')) {
      result.path = args[i]
    }
  }

  return result
}

// Main execution
function main() {
  let args = parseArgs()

  if (args.help) {
    console.log(HELP)
    process.exit(0)
  }

  if (args.listModels) {
    console.log('\nAvailable Models:\n')
    console.log(formatModelList())
    process.exit(0)
  }

  const projectRoot = args.path ? args.path : process.cwd()

  if (!existsSync(projectRoot)) {
    console.error(`Error: Path "${projectRoot}" does not exist`)
    process.exit(1)
  }

  console.log(`\n⚖️  Weighing: ${projectRoot}\n`)

  const excludeInfo = getExcludePatterns(args)

  const files = scanFiles(
    projectRoot,
    projectRoot,
    undefined,
    excludeInfo
  ).sort((a, b) => b.tokens - a.tokens)
  const totalTokens = files.reduce((sum, f) => sum + f.tokens, 0)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  if (files.length === 0) {
    console.log('No code files found in the specified directory.')
    process.exit(0)
  }

  // Group by extension
  const byExt = new Map<string, { count: number; tokens: number }>()
  for (let file of files) {
    let ext = extname(file.path) || 'no-ext'
    let curr = byExt.get(ext) || { count: 0, tokens: 0 }
    byExt.set(ext, { count: curr.count + 1, tokens: curr.tokens + file.tokens })
  }

  // Display results
  console.log('='.repeat(80))
  console.log('CODEMASS ANALYSIS')
  console.log('='.repeat(80))
  console.log(`Total Files: ${formatNumber(files.length)}`)
  console.log(
    `Total Tokens: ${formatNumber(totalTokens)} (o200k_base tokenizer)`
  )
  console.log(`Total Size: ${formatBytes(totalSize)}`)
  if (files.length > 0) {
    console.log(
      `Average Tokens/File: ${formatNumber(
        Math.round(totalTokens / files.length)
      )}`
    )
  }

  console.log('\nBY FILE TYPE:')
  console.log('-'.repeat(40))
  let sortedExt = Array.from(byExt.entries()).sort(
    (a, b) => b[1].tokens - a[1].tokens
  )
  for (let [ext, data] of sortedExt) {
    let pct = ((data.tokens / totalTokens) * 100).toFixed(1)
    console.log(
      `${ext.padEnd(10)} ${formatNumber(data.tokens).padStart(
        12
      )} tokens (${pct.padStart(4)}%) - ${data.count} files`
    )
  }

  console.log('\nTOP 20 FILES BY TOKEN COUNT:')
  console.log('-'.repeat(80))
  console.log('Tokens'.padStart(10), '  ', 'Size'.padStart(10), '  ', 'Path')
  console.log('-'.repeat(80))
  for (let file of files.slice(0, 20)) {
    console.log(
      formatNumber(file.tokens).padStart(10),
      '  ',
      formatBytes(file.size).padStart(10),
      '  ',
      file.path
    )
  }

  // Cost estimation based on selected model
  try {
    const model = getModelPricing(args.model)
    const modelId = args.model || DEFAULT_MODEL
    const isOpenAI = modelId.startsWith('gpt') || modelId.startsWith('o')

    const inputCost = (totalTokens / 1_000_000) * model.inputCost
    const outputCost = (totalTokens / 1_000_000) * model.outputCost
    console.log(`\n${'='.repeat(80)}`)
    console.log(`COST ESTIMATION (${model.name}):`)
    console.log(
      `Input:  ~$${inputCost.toFixed(2)} ($${model.inputCost}/1M tokens)`
    )
    console.log(
      `Output: ~$${outputCost.toFixed(2)} ($${model.outputCost}/1M tokens)`
    )
    console.log(
      `Total:  ~$${(inputCost + outputCost).toFixed(
        2
      )} (if output = input size)`
    )

    // Add caveat for non-OpenAI models
    if (!isOpenAI) {
      console.log(
        "\nNote: Token count is estimated using OpenAI's tokenizer (o200k_base)."
      )
      console.log(
        '      Actual tokens for non-OpenAI models may vary slightly.'
      )
    }
  } catch (error) {
    console.error(`\nError: ${error.message}`)
    console.log('Use --list-models to see available models')
    process.exit(1)
  }
  console.log('='.repeat(80))
}

// Run main when executed directly (not imported)
main()
