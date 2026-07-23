// --------------------------------------------------------
// lib/ai/providers/gemini.adapter.ts
// Google Gemini Provider Adapter
// --------------------------------------------------------

import {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  AIProviderHealthCheck,
} from './types';

export class GeminiAdapter implements AIProviderAdapter {
  readonly name = 'gemini';
  readonly defaultModel = 'gemini-2.0-flash';

  private readonly apiKey: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async complete(request: AIProviderRequest): Promise<AIProviderResponse> {
    const model = request.model || this.defaultModel;
    const startMs = Date.now();

    // Build contents array for Gemini API
    const contents = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? 1024,
      },
    };

    // Inject system instruction if provided
    if (request.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: request.systemPrompt }],
      };
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startMs;

    const candidate = data.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text || '';
    const usageMeta = data.usageMetadata || {};

    return {
      content,
      model,
      provider: this.name,
      tokensInput: usageMeta.promptTokenCount || 0,
      tokensOutput: usageMeta.candidatesTokenCount || 0,
      latencyMs,
      finishReason: candidate?.finishReason || 'STOP',
    };
  }

  async healthCheck(): Promise<AIProviderHealthCheck> {
    const start = Date.now();
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.defaultModel}?key=${this.apiKey}`
      );
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
