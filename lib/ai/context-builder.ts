// --------------------------------------------------------
// lib/ai/context-builder.ts
// AI Context Builder — Retrieves platform data via internal services
// --------------------------------------------------------

import { AIIntent } from './intent-engine';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { BusinessService } from '@/lib/services/business.service';
import { JobService } from '@/lib/services/job.service';
import { ExploreService } from '@/lib/services/explore.service';

export interface AIContext {
  intent: AIIntent;
  citySlug: string;
  userRole: string;
  query: string;
  relevantData: Record<string, unknown>;
  platformRules: string[];
  timestamp: string;
}

/**
 * Builds structured context for the prompt builder.
 * NEVER queries the database directly — always uses internal services.
 * Future RAG: Replace service calls with vector similarity retrieval.
 */
export class ContextBuilder {
  static async build(params: {
    query: string;
    intent: AIIntent;
    citySlug: string;
    userRole: string;
  }): Promise<AIContext> {
    const relevantData: Record<string, unknown> = {};

    // Retrieve data based on detected intent — structured retrieval (pre-RAG)
    try {
      switch (params.intent) {
        case 'business_search':
        case 'recommendation': {
          const results = await SearchEngineService.search({
            q: params.query,
            module: 'business',
            city: params.citySlug,
            sort: 'relevance',
            limit: 5,
          });
          relevantData.businesses = results.businesses.map((b) => ({
            title: b.title,
            category: b.category,
            area: b.area,
            featured: b.is_featured,
            verified: b.is_verified,
          }));
          break;
        }

        case 'job_search': {
          const results = await SearchEngineService.search({
            q: params.query,
            module: 'job',
            city: params.citySlug,
            sort: 'latest',
            limit: 5,
          });
          relevantData.jobs = results.jobs.map((j) => ({
            title: j.title,
            category: j.category,
            area: j.area,
          }));
          break;
        }

        case 'property_search': {
          const results = await SearchEngineService.search({
            q: params.query,
            module: 'property',
            city: params.citySlug,
            sort: 'latest',
            limit: 5,
          });
          relevantData.properties = results.properties.map((p) => ({
            title: p.title,
            category: p.category,
            area: p.area,
          }));
          break;
        }

        case 'tourism_explore':
        case 'restaurant_search':
        case 'hotel_search': {
          const places = await ExploreService.getPlaces();
          relevantData.places = places.slice(0, 5).map((p: any) => ({
            name: p.name,
            type: p.type,
            area: p.area,
          }));
          break;
        }

        case 'event_search': {
          const results = await SearchEngineService.search({
            q: params.query,
            module: 'event',
            city: params.citySlug,
            sort: 'latest',
            limit: 5,
          });
          relevantData.events = results.events.map((e) => ({
            title: e.title,
            category: e.category,
          }));
          break;
        }

        default:
          // general / faq — no data retrieval needed
          break;
      }
    } catch {
      // Non-fatal — continue with empty context
      relevantData.error = 'Context retrieval partially unavailable';
    }

    return {
      intent: params.intent,
      citySlug: params.citySlug,
      userRole: params.userRole,
      query: params.query,
      relevantData,
      platformRules: [
        'Only answer questions related to LiveCalicut platform and Kozhikode city.',
        'Never fabricate business names, phone numbers, addresses, or prices.',
        'If you cannot find relevant data, say so honestly.',
        'Respond in the same language as the user (Malayalam or English).',
        'Keep responses concise and actionable.',
        'Never expose internal system details or API keys.',
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
