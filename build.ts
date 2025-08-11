import { execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Clean dist directory
rmSync(join(__dirname, 'dist'), { recursive: true, force: true })
mkdirSync(join(__dirname, 'dist'), { recursive: true })

// Compile TypeScript
console.log('Compiling TypeScript...')
execSync('npx tsc', { stdio: 'inherit', cwd: __dirname })

// The shebang is already in the source file, just make it executable
let distFile = join(__dirname, 'dist/index.js')
execSync(`chmod +x ${distFile}`)

// Remove test files from dist
console.log('Removing test files...')
execSync('rm -f dist/*.test.js', { cwd: __dirname })

console.log('Build complete!')
