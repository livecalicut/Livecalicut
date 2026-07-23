import { createClient } from '@/lib/supabase/client';
import { GlobalSearchService, SearchResultItem } from '@/lib/services/global-search.service';

export interface ConciergeResponse {
  answer: string;
  intent: string;
  listings: SearchResultItem[];
  quickActions: string[];
}

export class AiConciergeService {
  private static supabase = createClient();

  static detectIntent(prompt: string): { intent: string; module: string } {
    const lower = prompt.toLowerCase();

    if (lower.includes('biriyani') || lower.includes('food') || lower.includes('restaurant') || lower.includes('cafe')) {
      return { intent: 'restaurant_search', module: 'businesses' };
    }
    if (lower.includes('job') || lower.includes('fresher') || lower.includes('career') || lower.includes('hiring')) {
      return { intent: 'job_search', module: 'jobs' };
    }
    if (lower.includes('flat') || lower.includes('villa') || lower.includes('hostel') || lower.includes('property') || lower.includes('rent')) {
      return { intent: 'property_search', module: 'properties' };
    }
    if (lower.includes('beach') || lower.includes('kappad') || lower.includes('visit') || lower.includes('tour') || lower.includes('place')) {
      return { intent: 'explore_search', module: 'businesses' };
    }
    if (lower.includes('event') || lower.includes('fest') || lower.includes('today')) {
      return { intent: 'event_search', module: 'events' };
    }

    return { intent: 'general_discovery', module: 'all' };
  }

  static async generateConciergeResponse(prompt: string): Promise<ConciergeResponse> {
    const { intent, module } = this.detectIntent(prompt);

    // Retrieve verified platform data
    const hits = await GlobalSearchService.searchAll(prompt, module);

    let answer = '';
    if (hits.length === 0) {
      answer = `I couldn't find exact listings for "${prompt}" in Kozhikode right now. You can try searching by neighborhood like Cyberpark, Beach Road, or SM Street.`;
    } else {
      answer = `Here are the top verified Kozhikode options matching "${prompt}":`;
    }

    const quickActions = [
      'Show Open Restaurants',
      'Cyberpark Tech Vacancies',
      '3 BHK Villas in Bypass',
      'Kozhikode Beach Pier',
    ];

    return {
      answer,
      intent,
      listings: hits.slice(0, 3),
      quickActions,
    };
  }
}
