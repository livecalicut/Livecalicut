// --------------------------------------------------------
// lib/ai/prompt-builder.ts
// AI Prompt Builder — Assembles system prompts with context injection
// --------------------------------------------------------

import { AIContext } from './context-builder';
import { AIMessage } from './providers/types';

export interface BuiltPrompt {
  systemPrompt: string;
  messages: AIMessage[];
}

export class PromptBuilder {
  /**
   * Build a complete prompt package from context + conversation history.
   * Injects: city, user role, platform rules, retrieved data, conversation history.
   */
  static build(params: {
    context: AIContext;
    userMessage: string;
    history?: AIMessage[];
  }): BuiltPrompt {
    const { context, userMessage, history = [] } = params;

    const systemPrompt = this.buildSystemPrompt(context);
    const messages: AIMessage[] = [
      // Inject summarized conversation history (last 6 turns max to control tokens)
      ...history.slice(-6),
      { role: 'user', content: userMessage },
    ];

    return { systemPrompt, messages };
  }

  private static buildSystemPrompt(context: AIContext): string {
    const cityName = context.citySlug === 'calicut' ? 'Kozhikode (Calicut)' : context.citySlug;
    const hasData = Object.keys(context.relevantData).length > 0 &&
                    !context.relevantData.error;

    const dataSection = hasData
      ? `\n\n## Retrieved Platform Data\n${JSON.stringify(context.relevantData, null, 2)}`
      : '';

    return `You are the LiveCalicut AI Concierge — an intelligent local assistant for ${cityName}, Kerala, India.

## Your Role
- User role: ${context.userRole}
- Current city: ${cityName}
- Detected intent: ${context.intent}
- Timestamp: ${context.timestamp}

## Platform Rules
${context.platformRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Your Capabilities
You can help users discover:
- Local businesses, restaurants, cafes, shops
- Jobs and career opportunities at Technopark / Cyberpark
- Properties for rent or sale
- Buy/sell classifieds (marketplace)
- Events, festivals, and cultural activities
- Tourist spots, beaches, historical places in Kozhikode
- Hotels, resorts, and homestays${dataSection}

## Response Style
- Be warm, helpful, and concise
- Use bullet points for lists
- Always prioritize data from the platform over general knowledge
- If data is unavailable, suggest the user browse the relevant section
`;
  }
}
