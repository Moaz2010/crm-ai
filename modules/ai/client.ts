/**
 * AI Client Module
 * Unified AI client supporting multiple providers
 */

import OpenAI from 'openai';

// Lazy initialization
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not set. AI features will be limited.');
      return null;
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string | null;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * AI Client with fallback support
 */
export const aiClient = {
  /**
   * Chat completion
   */
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const client = getOpenAIClient();
    
    if (!client) {
      // Return mock response when AI is not configured
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              error: 'AI not configured',
              message: 'Please configure OPENAI_API_KEY environment variable'
            }),
            role: 'assistant'
          },
          finish_reason: 'stop'
        }]
      };
    }

    const response = await client.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2000,
      response_format: options.response_format,
    });

    return {
      choices: response.choices.map(choice => ({
        message: {
          content: choice.message.content,
          role: choice.message.role,
        },
        finish_reason: choice.finish_reason || 'stop',
      })),
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      } : undefined,
    };
  },

  /**
   * Generate embedding for text
   */
  async embed(text: string): Promise<number[]> {
    const client = getOpenAIClient();
    
    if (!client) {
      return [];
    }

    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  },

  /**
   * Simple completion helper
   */
  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.chat({ messages });
    return response.choices[0]?.message?.content || '';
  },

  /**
   * JSON completion helper
   */
  async completeJSON<T>(prompt: string, systemPrompt?: string): Promise<T | null> {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.chat({
      messages,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    try {
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  },

  /**
   * Check if AI is available
   */
  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  },
};

export default aiClient;
