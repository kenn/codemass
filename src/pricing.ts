export interface ModelPricing {
  name: string
  inputCost: number // $ per 1M tokens
  outputCost: number // $ per 1M tokens
}

// Pricing data for latest LLM models
export const MODELS: Record<string, ModelPricing> = {
  // Anthropic Claude Models
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

  // OpenAI GPT Models
  'gpt-5': {
    name: 'gpt-5',
    inputCost: 1.25,
    outputCost: 10.0,
  },
  'gpt-5-mini': {
    name: 'gpt-5-mini',
    inputCost: 0.25,
    outputCost: 2.0,
  },
  'gpt-5-nano': {
    name: 'gpt-5-nano',
    inputCost: 0.05,
    outputCost: 0.4,
  },
  o3: {
    name: 'o3',
    inputCost: 2.0,
    outputCost: 8.0,
  },
  'gpt-4.1': {
    name: 'GPT-4.1',
    inputCost: 2.0,
    outputCost: 8.0,
  },
  'o4-mini': {
    name: 'o4-mini',
    inputCost: 1.1,
    outputCost: 4.4,
  },
  'gpt-4.1-mini': {
    name: 'GPT-4.1 mini',
    inputCost: 0.4,
    outputCost: 1.6,
  },
  'gpt-4.1-nano': {
    name: 'GPT-4.1 nano',
    inputCost: 0.1,
    outputCost: 0.4,
  },

  // Google Gemini Models
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
  // Group models by price tier
  const premium = ['opus-4']
  const professional = ['sonnet-4', 'o3', 'gpt-4.1', 'gpt-5', 'gemini-2.5-pro']
  const standard = ['o4-mini']
  const budget = ['gpt-4.1-mini', 'gpt-5-mini', 'gemini-2.5-flash']
  const minimal = ['gpt-4.1-nano', 'gpt-5-nano', 'gemini-2.5-flash-lite']

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
    formatGroup('Standard', standard),
    formatGroup('Budget', budget),
    formatGroup('Minimal', minimal),
  ].join('\n')
}
