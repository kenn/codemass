import { describe, it, expect } from 'vitest'
import { BASE_IGNORE_PATTERNS, EXCLUDABLE_EXTENSIONS } from './excludes.js'

describe('excludes', () => {
  it('should have base ignore patterns', () => {
    expect(BASE_IGNORE_PATTERNS).toContain('node_modules')
    expect(BASE_IGNORE_PATTERNS).toContain('.git')
  })

  it('should have excludable extensions', () => {
    expect(EXCLUDABLE_EXTENSIONS.json).toContain('.json')
    expect(EXCLUDABLE_EXTENSIONS.markdown).toContain('.md')
    expect(EXCLUDABLE_EXTENSIONS.yaml).toContain('.yml')
  })
})