import { describe, it, expect, vi } from 'vitest'
import { formatBytes, isBinary } from '../src/utils.js'
import * as fs from 'node:fs'

vi.mock('node:fs')

describe('formatBytes', () => {
  it('should format sizes correctly', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.50 KB')
    expect(formatBytes(2097152)).toBe('2.00 MB')
  })
})

describe('isBinary', () => {
  it('should detect binary vs text files', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from([0x00, 0x01, 0x02]))
    expect(isBinary('/test.bin')).toBe(true)

    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('Hello world'))
    expect(isBinary('/test.txt')).toBe(false)
  })
})
