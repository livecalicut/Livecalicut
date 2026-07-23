// --------------------------------------------------------
// lib/ai/providers/openai.adapter.ts
// OpenAI Provider Adapter (Future Ready)
// --------------------------------------------------------

import {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  AIProviderHealthCheck,
} from './types';

export class OpenAIAdapter implements AIProviderAdapter {
  readonly name = 'openai';
  readonly defaultModel = 'gpt-4o-mini';

  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async complete(request: AIProviderRequest): Promise<AIProviderResponse> {
    const model = request.model || this.defaultModel;
    const startMs = Date.now();

    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push(...request.messages.map((m) => ({ role: m.role, content: m.content })));

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startMs;

    return {
      content: data.choices?.[0]?.message?.content || '',
      model,
      provider: this.name,
      tokensInput: data.usage?.prompt_tokens || 0,
      tokensOutput: data.usage?.completion_tokens || 0,
      latencyMs,
      finishReason: data.choices?.[0]?.finish_reason || 'stop',
    };
  }

  async healthCheck(): Promise<AIProviderHealthCheck> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return {
        provider: this.name,
        healthy: response.ok,
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      return { provider: this.name, healthy: false, error: err.message };
    }
  }
}
