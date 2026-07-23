// --------------------------------------------------------
// lib/services/ai-gateway.service.ts
// AI Gateway Service — Central Orchestrator
// --------------------------------------------------------

import { createClient } from '@/lib/supabase/client';
import { IntentEngine } from '@/lib/ai/intent-engine';
import { ContextBuilder } from '@/lib/ai/context-builder';
import { PromptBuilder } from '@/lib/ai/prompt-builder';
import { executeWithFallback } from '@/lib/ai/providers/registry';
import { AIMessage } from '@/lib/ai/providers/types';

export interface ChatRequest {
  message: string;
  sessionId?: string;
  userId?: string;
  citySlug?: string;
  userRole?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  messageId: string;
  intent: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  fallbackUsed?: boolean;
}

export class AIGatewayService {
  private static supabase = createClient();

  /**
   * Main entry point — processes a chat message through the full AI pipeline:
   * Persist → Classify → Build Context → Build Prompt → Execute (with fallback) → Store → Track
   */
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    const {
      message,
      userId,
      citySlug = 'calicut',
      userRole = 'guest',
    } = request;

    const startMs = Date.now();

    // Step 1: Resolve or create session
    const sessionId = request.sessionId || await this.createSession(userId, citySlug, userRole);

    // Step 2: Fetch conversation history (last 6 turns)
    const history = await this.getHistory(sessionId);

    // Step 3: Intent classification (zero-cost, synchronous)
    const intent = IntentEngine.classify(message);

    // Step 4: Build context via internal service retrieval (pre-RAG)
    const context = await ContextBuilder.build({ query: message, intent, citySlug, userRole });

    // Step 5: Build prompt package
    const { systemPrompt, messages } = PromptBuilder.build({
      context,
      userMessage: message,
      history,
    });

    // Step 6: Execute with provider fallback chain
    const aiResponse = await executeWithFallback({
      messages,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1024,
    });

    const totalLatency = Date.now() - startMs;

    // Step 7: Persist user message
    await this.persistMessage(sessionId, 'user', message, intent);

    // Step 8: Persist AI reply
    const savedReply = await this.persistMessage(
      sessionId,
      'assistant',
      aiResponse.content,
      intent,
      aiResponse.model,
      aiResponse.provider,
      aiResponse.tokensInput,
      aiResponse.tokensOutput,
      totalLatency
    );

    // Step 9: Update usage metrics (async, non-blocking)
    this.trackUsage(aiResponse.provider, aiResponse.model, aiResponse.tokensInput, aiResponse.tokensOutput, totalLatency)
      .catch(() => {});

    // Step 10: Update session intent
    this.supabase
      .from('ai_sessions')
      .update({ intent })
      .eq('id', sessionId)
      .then(() => {});

    return {
      reply: aiResponse.content,
      sessionId,
      messageId: savedReply?.id || '',
      intent,
      provider: aiResponse.provider,
      model: aiResponse.model,
      tokensUsed: aiResponse.tokensInput + aiResponse.tokensOutput,
      latencyMs: totalLatency,
      fallbackUsed: aiResponse.fallbackUsed,
    };
  }

  /**
   * Get conversation history for a session
   */
  static async getConversationHistory(sessionId: string, limit: number = 20) {
    const { data } = await this.supabase
      .from('ai_messages')
      .select('id, role, content, intent, model_used, provider_used, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    return data || [];
  }

  /**
   * Clear all messages for a session
   */
  static async clearHistory(sessionId: string, userId: string) {
    // Validate ownership
    const { data: session } = await this.supabase
      .from('ai_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) throw new Error('Session not found or access denied');

    await this.supabase.from('ai_messages').delete().eq('session_id', sessionId);
  }

  /**
   * Submit feedback for an AI message
   */
  static async submitFeedback(messageId: string, userId: string, thumbsUp: boolean, comment?: string) {
    const { data, error } = await this.supabase
      .from('ai_feedback')
      .insert({
        message_id: messageId,
        user_id: userId,
        thumbs_up: thumbsUp,
        rating: thumbsUp ? 5 : 2,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * List active AI models from the registry
   */
  static async listModels() {
    const { data } = await this.supabase
      .from('ai_models')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false });

    return data || [];
  }

  // ------------------------------------------------
  // Private helpers
  // ------------------------------------------------

  private static async createSession(userId?: string, citySlug?: string, userRole?: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('ai_sessions')
      .insert({
        user_id: userId || null,
        city_slug: citySlug || 'calicut',
        user_role: userRole || 'guest',
        is_active: true,
      } as any)
      .select('id')
      .single();

    if (error) throw new Error(`Session creation failed: ${error.message}`);
    return data.id;
  }

  private static async getHistory(sessionId: string): Promise<AIMessage[]> {
    const { data } = await this.supabase
      .from('ai_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(12);

    return (data || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  }

  private static async persistMessage(
    sessionId: string,
    role: string,
    content: string,
    intent?: string,
    modelUsed?: string,
    providerUsed?: string,
    tokensInput?: number,
    tokensOutput?: number,
    latencyMs?: number
  ) {
    const { data } = await this.supabase
      .from('ai_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        intent: intent || null,
        model_used: modelUsed || null,
        provider_used: providerUsed || null,
        tokens_input: tokensInput || 0,
        tokens_output: tokensOutput || 0,
        latency_ms: latencyMs || 0,
      } as any)
      .select('id')
      .single();

    return data;
  }

  private static async trackUsage(
    provider: string,
    model: string,
    tokensIn: number,
    tokensOut: number,
    latencyMs: number
  ) {
    await this.supabase.rpc('upsert_ai_usage' as any, {
      p_provider: provider,
      p_model: model,
      p_tokens_in: tokensIn,
      p_tokens_out: tokensOut,
      p_latency: latencyMs,
    });
  }
}
