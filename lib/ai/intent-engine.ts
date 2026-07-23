// --------------------------------------------------------
// lib/ai/intent-engine.ts
// AI Intent Classifier — Maps user messages to platform intents
// --------------------------------------------------------

export type AIIntent =
  | 'business_search'
  | 'job_search'
  | 'property_search'
  | 'marketplace_search'
  | 'event_search'
  | 'tourism_explore'
  | 'restaurant_search'
  | 'hotel_search'
  | 'merchant_insight'
  | 'admin_insight'
  | 'faq'
  | 'recommendation'
  | 'review_summary'
  | 'content_summary'
  | 'general';

interface IntentRule {
  intent: AIIntent;
  keywords: string[];
  patterns?: RegExp[];
}

// Rule-based intent detection — fast, zero API calls, zero cost
const INTENT_RULES: IntentRule[] = [
  {
    intent: 'business_search',
    keywords: ['business', 'shop', 'store', 'company', 'service', 'clinic', 'agency', 'outlet', 'find', 'near me'],
  },
  {
    intent: 'job_search',
    keywords: ['job', 'jobs', 'vacancy', 'hiring', 'career', 'work', 'salary', 'fresher', 'experience', 'apply'],
  },
  {
    intent: 'property_search',
    keywords: ['flat', 'apartment', 'house', 'rent', 'buy', 'property', 'villa', 'plot', 'land', 'pg', 'bhk'],
  },
  {
    intent: 'marketplace_search',
    keywords: ['sell', 'buy', 'second hand', 'used', 'mobile', 'bike', 'car', 'classifieds', 'listing'],
  },
  {
    intent: 'event_search',
    keywords: ['event', 'festival', 'concert', 'show', 'exhibition', 'fair', 'happening', 'program'],
  },
  {
    intent: 'restaurant_search',
    keywords: ['restaurant', 'food', 'eat', 'biriyani', 'biryani', 'lunch', 'dinner', 'cafe', 'coffee', 'parotta'],
  },
  {
    intent: 'hotel_search',
    keywords: ['hotel', 'stay', 'room', 'resort', 'homestay', 'accommodation', 'night'],
  },
  {
    intent: 'tourism_explore',
    keywords: ['beach', 'visit', 'tourist', 'place', 'tourism', 'sightseeing', 'travel', 'kozhikode', 'calicut', 'explore'],
  },
  {
    intent: 'merchant_insight',
    keywords: ['my business', 'my listing', 'leads', 'views', 'analytics', 'performance', 'customers'],
  },
  {
    intent: 'review_summary',
    keywords: ['reviews', 'rating', 'feedback', 'opinions', 'what do people say'],
  },
  {
    intent: 'recommendation',
    keywords: ['recommend', 'suggest', 'best', 'top', 'popular', 'trending', 'what should'],
  },
  {
    intent: 'faq',
    keywords: ['how', 'what is', 'who', 'when', 'where', 'why', 'explain', 'tell me about'],
  },
];

export class IntentEngine {
  /**
   * Classify a user message into a structured LiveCalicut intent.
   * Uses rule-based matching for zero-cost, instant classification.
   */
  static classify(message: string): AIIntent {
    const lower = message.toLowerCase();
    const words = lower.split(/\s+/);

    // Score each intent
    const scores: Map<AIIntent, number> = new Map();

    for (const rule of INTENT_RULES) {
      let score = 0;
      for (const keyword of rule.keywords) {
        if (lower.includes(keyword)) score += keyword.split(' ').length; // Multi-word = higher weight
      }
      if (rule.patterns) {
        for (const pattern of rule.patterns) {
          if (pattern.test(lower)) score += 3;
        }
      }
      if (score > 0) scores.set(rule.intent, (scores.get(rule.intent) || 0) + score);
    }

    if (scores.size === 0) return 'general';

    // Return highest scored intent
    let best: AIIntent = 'general';
    let bestScore = 0;
    scores.forEach((score, intent) => {
      if (score > bestScore) { bestScore = score; best = intent; }
    });

    return best;
  }

  /**
   * Returns a human-readable description of the detected intent
   * for logging and debugging.
   */
  static describe(intent: AIIntent): string {
    const descriptions: Record<AIIntent, string> = {
      business_search: 'User is searching for a local business',
      job_search: 'User is looking for job opportunities',
      property_search: 'User is searching for property (rent/buy)',
      marketplace_search: 'User is browsing buy/sell classifieds',
      event_search: 'User is looking for upcoming events',
      tourism_explore: 'User wants to explore Kozhikode tourist spots',
      restaurant_search: 'User is looking for food / restaurants',
      hotel_search: 'User needs hotel or accommodation',
      merchant_insight: 'Merchant seeking business analytics insight',
      admin_insight: 'Admin querying platform analytics',
      faq: 'User has a general platform FAQ question',
      recommendation: 'User seeking personalized recommendations',
      review_summary: 'User wants a summary of reviews',
      content_summary: 'User wants content summarized',
      general: 'General conversation or unclassified intent',
    };
    return descriptions[intent] || 'Unknown intent';
  }
}
