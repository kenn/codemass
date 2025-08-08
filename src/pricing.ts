export interface ModelPricing {
  name: string
  inputCost: number // $ per 1M tokens
  outputCost: number // $ per 1M tokens
}

// Pricing data for latest LLM models
export const MODELS: Record<string, ModelPricing> = {
  // Anthropic Models
  'opus-4': {
    name: 'Claude Opus 4',
    inputCost: 15.0,
    outputCost: 75.0,
  },
  'sonnet-4': {
    name: 'Claude Sonnet 4',
    inputCost: 3.0,
    outputCost: 15.0,
  },

  // OpenAI Models
  'gpt-5': {
    name: 'GPT-5',
    inputCost: 1.25,
    outputCost: 10.0,
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
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    inputCost: 1.25,
    outputCost: 10.0,
  },
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    inputCost: 0.3,
    outputCost: 2.5,
  },
  'gemini-2.5-flash-lite': {
    name: 'Gemini 2.5 Flash-Lite',
    inputCost: 0.1,
    outputCost: 0.4,
  },
}

// Default model (Sonnet 4 - good balance of cost and capability)
export const DEFAULT_MODEL = 'sonnet-4'

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
  const premium = ['opus-4']
  const professional = ['sonnet-4', 'gpt-5', 'gemini-2.5-pro']
  const budget = ['gpt-5-mini', 'gemini-2.5-flash']
  const minimal = ['gpt-5-nano', 'gemini-2.5-flash-lite']

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
