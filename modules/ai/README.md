# Shared AI Module

**Owner:** Shared (Moaz coordinates)

## Purpose
This module contains all shared AI logic used across the application:
- Centralized AI client (OpenAI, Gemini)
- Reusable prompt templates
- Multi-step AI pipelines
- Token management and rate limiting

## Folder Structure

### `client.ts`
AI client wrapper for OpenAI/Gemini.

**Functions to create:**
```typescript
export async function callAI(prompt: string, options?: AIOptions): Promise<string>
export async function callAIStreaming(prompt: string): Promise<ReadableStream>
```

### `prompts/`
Reusable prompt templates.

**Files to create:**
- `lead-enrichment.ts` - Lead enrichment prompts
- `lead-parsing.ts` - Parsing prompts
- `lead-scoring.ts` - Scoring prompts
- `scheduling.ts` - Scheduling assistant prompts
- `email-generation.ts` - Email writing prompts
- `categorization.ts` - Auto-tagging prompts

### `pipelines/`
Multi-step AI workflows.

**Files to create:**
- `enrichment-pipeline.ts` - Full enrichment flow
- `qualification-pipeline.ts` - Lead qualification flow
- `summary-pipeline.ts` - Generate summaries

### `utils/`
Helper functions.

**Files to create:**
- `token-counter.ts` - Count AI tokens
- `rate-limiter.ts` - Rate limit AI calls
- `response-parser.ts` - Parse AI responses

### `types.ts`
TypeScript interfaces for AI.

## Example Usage

```typescript
import { callAI } from '@/modules/ai/client';
import { leadEnrichmentPrompt } from '@/modules/ai/prompts/lead-enrichment';

// Use AI to enrich lead
const result = await callAI(
  leadEnrichmentPrompt({ name, company, title }),
  { model: 'gpt-4o', temperature: 0.2 }
);
```

## Prompt Template Example

```typescript
// prompts/lead-parsing.ts
export const linkedInParsePrompt = (profileText: string) => `
You are a lead data extractor. Parse this LinkedIn profile and extract:
- Full name
- Job title
- Company
- Location
- Skills (top 5)
- Experience summary (2-3 sentences)

Profile:
${profileText}

Return as JSON.
`;
```

## Testing

```bash
pnpm test modules/ai
```

## Dependencies

- OpenAI API
- Vercel AI SDK
- LangChain (optional)
