export interface FileStats {
  path: string
  tokens: number
  size: number
}

export interface CliArgs {
  path?: string
  help?: boolean
  exclude?: string[]
  noJson?: boolean
  noMarkdown?: boolean
  noYaml?: boolean
  model?: string
  listModels?: boolean
}
