// --------------------------------------------------------
// lib/ai/providers/types.ts
// Shared AI Provider Interface & Contract Types
// --------------------------------------------------------

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIProviderResponse {
  content: string;
  model: string;
  provider: string;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  finishReason?: string;
}

export interface AIProviderHealthCheck {
  provider: string;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

/**
 * Every AI provider adapter must implement this interface.
 * Swapping from Gemini → OpenAI → Claude requires ZERO changes
 * to AIGatewayService or route handlers.
 */
export interface AIProviderAdapter {
  readonly name: string;
  readonly defaultModel: string;
  complete(request: AIProviderRequest): Promise<AIProviderResponse>;
  healthCheck(): Promise<AIProviderHealthCheck>;
}
