import { describe, it, expect } from 'vitest'
import { getModelPricing, listModels, formatModelList } from '../src/pricing.js'

describe('pricing module', () => {
  it('should return default model when no ID provided', () => {
    const model = getModelPricing()
    expect(model.name).toBeDefined()
    expect(model.inputCost).toBeGreaterThan(0)
    expect(model.outputCost).toBeGreaterThan(0)
  })

  it('should throw error for unknown model', () => {
    expect(() => getModelPricing('unknown')).toThrow('Unknown model: unknown')
  })

  it('should list all models', () => {
    const models = listModels()
    expect(models.length).toBeGreaterThan(0)
  })

  it('should format model list with tiers', () => {
    const output = formatModelList()
    expect(output).toContain('Premium:')
    expect(output).toContain('Professional:')
    expect(output).toContain('Budget:')
  })
})
