import { readFileSync } from 'node:fs'

export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(2)} KB`
  return `${(b / (1024 * 1024)).toFixed(2)} MB`
}

export function isBinary(filePath: string): boolean {
  // Simple binary detection - check first 8000 bytes for null bytes
  try {
    const fd = readFileSync(filePath)
    const chunk = fd.subarray(0, Math.min(8000, fd.length))
    return chunk.includes(0)
  } catch {
    return true
  }
}

export function errorMessage(msg: string): string {
  return `\x1b[31m${msg}\x1b[0m`
}