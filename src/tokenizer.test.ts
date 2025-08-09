import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fs from 'node:fs'
import { getEncoding } from 'js-tiktoken'

// Mock modules
vi.mock('node:fs')
vi.mock('js-tiktoken')

describe('token counting', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Mock encoding
    const mockEncode = vi.fn().mockImplementation((text: string) => ({
      length: text.length, // Simple mock: 1 char = 1 token
    }))
    vi.mocked(getEncoding).mockReturnValue({ encode: mockEncode } as any)
  })

  it('should count tokens in a file', async () => {
    const { countTokens } = await import('./tokenizer.js')

    vi.mocked(fs.readFileSync).mockReturnValue('Hello World')
    const tokens = countTokens('/test.txt')

    expect(tokens).toBe(11) // "Hello World" = 11 characters
  })

  it('should handle file read errors', async () => {
    const { countTokens } = await import('./tokenizer.js')

    // Mock console.error to silence the error message
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found')
    })

    const tokens = countTokens('/nonexistent.txt')
    expect(tokens).toBe(0)

    // Restore console.error
    consoleErrorSpy.mockRestore()
  })
})
