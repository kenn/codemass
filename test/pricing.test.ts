import { describe, it, expect } from 'vitest'
import {
  getModelPricing,
  listModels,
  formatModelList,
  MODELS,
} from '../src/pricing.js'

describe('pricing module', () => {
  describe('getModelPricing', () => {
    it('should return default model when no ID provided', () => {
      const model = getModelPricing()
      expect(model.name).toBe('Claude Sonnet 4')
      expect(model.inputCost).toBe(3.0)
      expect(model.outputCost).toBe(15.0)
    })

    it('should return correct pricing for specific models', () => {
      const claude = getModelPricing('opus-4')
      expect(claude.inputCost).toBe(15.0)
      expect(claude.outputCost).toBe(75.0)

      const gptMini = getModelPricing('gpt-5-mini')
      expect(gptMini.inputCost).toBe(0.25)
      expect(gptMini.outputCost).toBe(2.0)
    })

    it('should throw error for unknown model', () => {
      expect(() => getModelPricing('unknown')).toThrow('Unknown model: unknown')
    })
  })

  describe('listModels', () => {
    it('should return all model IDs', () => {
      const models = listModels()
      expect(models).toContain('opus-4')
      expect(models).toContain('gpt-5')
      expect(models).toContain('gpt-5-mini')
      expect(models.length).toBe(8)
    })
  })

  describe('formatModelList', () => {
    it('should format models by price tier', () => {
      const output = formatModelList()
      expect(output).toContain('Premium:')
      expect(output).toContain('Professional:')
      expect(output).toContain('Budget:')
      expect(output).toContain('opus-4')
      expect(output).toContain('$15/$75 per 1M')
    })
  })

  describe('pricing accuracy', () => {
    it('should have correct OpenAI model pricing', () => {
      expect(MODELS['gpt-5'].inputCost).toBe(1.25)
      expect(MODELS['gpt-5'].outputCost).toBe(10.0)
      expect(MODELS['gpt-5-mini'].inputCost).toBe(0.25)
      expect(MODELS['gpt-5-mini'].outputCost).toBe(2.0)
      expect(MODELS['gpt-5-nano'].inputCost).toBe(0.05)
      expect(MODELS['gpt-5-nano'].outputCost).toBe(0.4)
    })

    it('should have correct Claude model pricing', () => {
      expect(MODELS['opus-4'].inputCost).toBe(15.0)
      expect(MODELS['sonnet-4'].outputCost).toBe(15.0)
    })

    it('should have correct Gemini model pricing', () => {
      expect(MODELS['gemini-2.5-pro'].inputCost).toBe(1.25)
      expect(MODELS['gemini-2.5-flash'].outputCost).toBe(2.5)
    })
  })
})
