# codemass

![codemass logo](/kenn/codemass/raw/main/images/logo.png)

⚖️ Weigh your code in tokens - calculate AI API costs for your codebase before feeding it to LLMs.

## Features

- 🔢 **Universal token counting** - Counts tokens in ALL text files
- 💰 **Multi-model cost estimation** - Support for 10+ LLM models with current pricing
- 🚫 **Smart exclusions** - Respects `.gitignore` and skips binary files
- 📊 **Detailed breakdown** - See token distribution by file type
- 🎯 **Flexible filtering** - Exclude specific file types or patterns

## Installation

```bash
npx codemass
```

Or install globally:

```bash
npm install -g codemass
```

## Usage

```bash
# Analyze current directory
npx codemass

# Analyze specific directory
npx codemass ./src

# Choose pricing model (default: sonnet-4)
npx codemass --model gpt-5

# Exclude file types
npx codemass --no-json --no-yaml
npx codemass --exclude .test.js,.spec.ts

# List available models
npx codemass --list-models
```

## Options

- `--model <id>` - Choose LLM model for pricing (default: sonnet-4)
- `--list-models` - Show all available models with pricing
- `--exclude <exts>` - Exclude specific extensions (comma-separated)
- `--no-json` - Exclude JSON files
- `--no-markdown` - Exclude Markdown files
- `--no-yaml` - Exclude YAML files

## Supported Models

| Model                         | Input $/1M | Output $/1M |
| ----------------------------- | ---------- | ----------- |
| **Claude Opus 4**             | $15.00     | $75.00      |
| **Claude Sonnet 4** (default) | $3.00      | $15.00      |
| **Gemini 2.5 Pro**            | $1.25      | $10.00      |
| **GPT-5**                     | $1.25      | $10.00      |
| **Gemini 2.5 Flash**          | $0.30      | $2.50       |
| **GPT-5 mini**                | $0.25      | $2.00       |
| **Gemini 2.5 Flash-Lite**     | $0.10      | $0.40       |
| **GPT-5 nano**                | $0.05      | $0.40       |

## How It Works

1. **Scans all text files** in your project (respecting `.gitignore`)
2. **Counts tokens** using OpenAI's o200k_base tokenizer
3. **Calculates costs** based on selected model pricing
4. **Shows breakdown** by file type and largest files

## Example Output

```
⚖️  Weighing: /path/to/project

================================================================================
CODEMASS ANALYSIS
================================================================================
Total Files: 142
Total Tokens: 285,431 (o200k_base tokenizer)
Total Size: 1.23 MB
Average Tokens/File: 2,010

BY FILE TYPE:
----------------------------------------
.ts        156,234 tokens (54.7%) - 89 files
.tsx        98,456 tokens (34.5%) - 42 files
.css        30,741 tokens (10.8%) - 11 files

TOP 20 FILES BY TOKEN COUNT:
--------------------------------------------------------------------------------
    Tokens        Size    Path
--------------------------------------------------------------------------------
     5,234      23.4 KB    src/components/Dashboard.tsx
     4,892      21.2 KB    src/utils/parser.ts
     ...

================================================================================
COST ESTIMATION (Claude Sonnet 4):
Input:  ~$0.86 ($3/1M tokens)
Output: ~$4.28 ($15/1M tokens)
Total:  ~$5.14 (if output = input size)
================================================================================
```

## Notes

- Token counts use OpenAI's o200k_base tokenizer
- For non-OpenAI models, token counts are estimates and may vary slightly
- Binary files are automatically detected and skipped
- Always respects `.gitignore` patterns

## License

MIT
