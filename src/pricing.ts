export interface ModelPricing {
  name: string
  inputCost: number // $ per 1M tokens
  outputCost: number // $ per 1M tokens
}

// Pricing data for latest LLM models (December 2025)
export const MODELS: Record<string, ModelPricing> = {
  // Anthropic Models
  'opus-4.5': {
    name: 'Claude Opus 4.5',
    inputCost: 5.0,
    outputCost: 25.0,
  },
  'sonnet-4.5': {
    name: 'Claude Sonnet 4.5',
    inputCost: 3.0,
    outputCost: 15.0,
  },
  'haiku-4.5': {
    name: 'Claude Haiku 4.5',
    inputCost: 1.0,
    outputCost: 5.0,
  },

  // OpenAI Models
  'gpt-5.2': {
    name: 'GPT-5.2',
    inputCost: 1.75,
    outputCost: 14.0,
  },
  'gpt-5-mini': {
    name: 'GPT-5 mini',
    inputCost: 0.25,
    outputCost: 2.0,
  },
  'gpt-5-nano': {
    name: 'GPT-5 nano',
    inputCost: 0.05,
    outputCost: 0.4,
  },

  // Google Models
  'gemini-3-pro': {
    name: 'Gemini 3 Pro',
    inputCost: 2.0,
    outputCost: 12.0,
  },
  'gemini-3-flash': {
    name: 'Gemini 3 Flash',
    inputCost: 0.5,
    outputCost: 3.0,
  },
}

// Default model (Sonnet 4.5 - good balance of cost and capability)
export const DEFAULT_MODEL = 'sonnet-4.5'

export function getModelPricing(modelId?: string): ModelPricing {
  const id = modelId || DEFAULT_MODEL
  const model = MODELS[id]

  if (!model) {
    throw new Error(
      `Unknown model: ${id}. Available models: ${Object.keys(MODELS).join(
        ', '
      )}`
    )
  }

  return model
}

export function listModels(): string[] {
  return Object.keys(MODELS)
}

export function formatModelList(): string {
  // Group models by price tier - consolidated structure without standard tier
  const premium = ['opus-4.5', 'gemini-3-pro']
  const professional = ['sonnet-4.5', 'gpt-5.2']
  const budget = ['haiku-4.5', 'gemini-3-flash']
  const minimal = ['gpt-5-mini', 'gpt-5-nano']

  const formatGroup = (title: string, ids: string[]) => {
    const header = `\n${title}:\n`
    const items = ids
      .filter((id) => MODELS[id]) // Only include models that exist
      .map((id) => {
        const model = MODELS[id]
        return `  ${id.padEnd(20)} - ${model.name.padEnd(20)} ($${
          model.inputCost
        }/$${model.outputCost} per 1M)`
      })
      .join('\n')
    return header + items
  }

  return [
    formatGroup('Premium', premium),
    formatGroup('Professional', professional),
    formatGroup('Budget', budget),
    formatGroup('Minimal', minimal),
  ].join('\n')
}
