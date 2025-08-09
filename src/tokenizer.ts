import { readFileSync } from 'node:fs'
import { getEncoding } from 'js-tiktoken'

const ENCODER = getEncoding('o200k_base')

export function countTokens(filePath: string): number {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return ENCODER.encode(content).length
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error.message}`)
    return 0
  }
}
