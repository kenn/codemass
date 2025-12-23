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
      expect(model.name).toBe('Claude Sonnet 4.5')
      expect(model.inputCost).toBe(3.0)
      expect(model.outputCost).toBe(15.0)
    })

    it('should return correct pricing for specific models', () => {
      const claude = getModelPricing('opus-4.5')
      expect(claude.inputCost).toBe(5.0)
      expect(claude.outputCost).toBe(25.0)

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
      expect(models).toContain('opus-4.5')
      expect(models).toContain('gpt-5.2')
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
      expect(output).toContain('opus-4.5')
      expect(output).toContain('$5/$25 per 1M')
    })
  })

  describe('pricing accuracy', () => {
    it('should have correct OpenAI model pricing', () => {
      expect(MODELS['gpt-5.2'].inputCost).toBe(1.75)
      expect(MODELS['gpt-5.2'].outputCost).toBe(14.0)
      expect(MODELS['gpt-5-mini'].inputCost).toBe(0.25)
      expect(MODELS['gpt-5-mini'].outputCost).toBe(2.0)
      expect(MODELS['gpt-5-nano'].inputCost).toBe(0.05)
      expect(MODELS['gpt-5-nano'].outputCost).toBe(0.4)
    })

    it('should have correct Claude model pricing', () => {
      expect(MODELS['opus-4.5'].inputCost).toBe(5.0)
      expect(MODELS['sonnet-4.5'].outputCost).toBe(15.0)
    })

    it('should have correct Gemini model pricing', () => {
      expect(MODELS['gemini-3-pro'].inputCost).toBe(2.0)
      expect(MODELS['gemini-3-flash'].outputCost).toBe(3.0)
    })
  })
})
