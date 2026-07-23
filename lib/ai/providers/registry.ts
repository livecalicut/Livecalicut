// --------------------------------------------------------
// lib/ai/providers/registry.ts
// AI Provider Registry & Fallback Chain Manager
// --------------------------------------------------------

import { AIProviderAdapter, AIProviderRequest, AIProviderResponse } from './types';
import { GeminiAdapter } from './gemini.adapter';
import { OpenAIAdapter } from './openai.adapter';

/**
 * Build the ordered fallback chain from environment configuration.
 * Providers are tried in order: first healthy one wins.
 */
function buildProviderChain(): AIProviderAdapter[] {
  const chain: AIProviderAdapter[] = [];

  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (geminiKey) {
    chain.push(new GeminiAdapter(geminiKey));
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    chain.push(new OpenAIAdapter(openaiKey));
  }

  return chain;
}

// Singleton chain — initialized once per process
let _chain: AIProviderAdapter[] | null = null;

export function getProviderChain(): AIProviderAdapter[] {
  if (!_chain) {
    _chain = buildProviderChain();
  }
  return _chain;
}

export function getDefaultProvider(): AIProviderAdapter {
  const chain = getProviderChain();
  if (chain.length === 0) {
    throw new Error('No AI providers configured. Set GOOGLE_GEMINI_API_KEY or OPENAI_API_KEY.');
  }
  return chain[0];
}

/**
 * Execute with automatic fallback — tries providers in chain order.
 * Throws only if ALL providers fail.
 */
export async function executeWithFallback(
  request: AIProviderRequest
): Promise<AIProviderResponse & { fallbackUsed?: boolean }> {
  const chain = getProviderChain();
  const errors: string[] = [];

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i];
    try {
      const response = await provider.complete(request);
      return { ...response, fallbackUsed: i > 0 };
    } catch (err: any) {
      errors.push(`[${provider.name}] ${err.message}`);
      // Continue to next provider in fallback chain
    }
  }

  throw new Error(
    `All AI providers exhausted. Errors: ${errors.join(' | ')}`
  );
}
