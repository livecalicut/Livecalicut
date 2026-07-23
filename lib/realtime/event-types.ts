// --------------------------------------------------------
// lib/realtime/event-types.ts
// Platform Event Type Registry & Channel Constants
// --------------------------------------------------------

// ---- Platform Event Types ----
export const PLATFORM_EVENTS = {
  // Business lifecycle
  BUSINESS_CREATED:   'business.created',
  BUSINESS_UPDATED:   'business.updated',
  BUSINESS_APPROVED:  'business.approved',
  BUSINESS_REJECTED:  'business.rejected',
  BUSINESS_DELETED:   'business.deleted',
  BUSINESS_FEATURED:  'business.featured',

  // Jobs
  JOB_CREATED:        'job.created',
  JOB_UPDATED:        'job.updated',
  JOB_CLOSED:         'job.closed',
  JOB_APPLIED:        'job.applied',

  // Marketplace
  MARKETPLACE_CREATED:   'marketplace.created',
  MARKETPLACE_UPDATED:   'marketplace.updated',
  MARKETPLACE_SOLD:      'marketplace.sold',
  MARKETPLACE_DELETED:   'marketplace.deleted',

  // Properties
  PROPERTY_CREATED:   'property.created',
  PROPERTY_UPDATED:   'property.updated',
  PROPERTY_INQUIRY:   'property.inquiry',
  PROPERTY_DELETED:   'property.deleted',

  // City Feed
  NEWS_PUBLISHED:     'news.published',
  EVENT_CREATED:      'event.created',
  EVENT_UPDATED:      'event.updated',
  EVENT_CANCELLED:    'event.cancelled',

  // Reviews
  REVIEW_CREATED:     'review.created',
  REVIEW_REPLIED:     'review.replied',

  // Payments & Subscriptions
  PAYMENT_COMPLETED:         'payment.completed',
  PAYMENT_FAILED:            'payment.failed',
  SUBSCRIPTION_ACTIVATED:    'subscription.activated',
  SUBSCRIPTION_RENEWED:      'subscription.renewed',
  SUBSCRIPTION_CANCELLED:    'subscription.cancelled',
  SUBSCRIPTION_EXPIRED:      'subscription.expired',

  // User lifecycle
  USER_REGISTERED:    'user.registered',
  USER_VERIFIED:      'user.verified',
  USER_BANNED:        'user.banned',

  // Notifications
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_READ:    'notification.read',

  // AI & Search
  AI_SESSION_STARTED: 'ai.session_started',
  SEARCH_TRENDING:    'search.trending_updated',

  // System
  SYSTEM_MAINTENANCE: 'system.maintenance',
  SYSTEM_ANNOUNCEMENT: 'system.announcement',
  ADMIN_ALERT:        'admin.alert',
} as const;

export type PlatformEventType = typeof PLATFORM_EVENTS[keyof typeof PLATFORM_EVENTS];

// ---- Channel Names ----
export const CHANNELS = {
  // Public (no auth required)
  PUBLIC_ANNOUNCEMENTS: 'public.announcements',
  PUBLIC_TRENDING:      'public.trending',

  // City-scoped
  city: (slug: string) => `city.${slug}`,
  area: (citySlug: string, area: string) => `area.${citySlug}.${encodeURIComponent(area)}`,

  // User-scoped (auth required)
  user: (userId: string) => `user.${userId}`,

  // Merchant (auth + merchant role)
  MERCHANT_NOTIFICATIONS: 'merchant.notifications',
  merchant: (merchantId: string) => `merchant.${merchantId}`,

  // Admin (auth + admin/moderator role)
  ADMIN_NOTIFICATIONS: 'admin.notifications',
  SYSTEM_HEALTH:       'system.health',
  SYSTEM_ALERTS:       'system.alerts',
} as const;

// ---- Event Priority Levels ----
export const EVENT_PRIORITY = {
  CRITICAL: 1,
  HIGH:     3,
  NORMAL:   5,
  LOW:      8,
  BATCH:    10,
} as const;

// ---- Event Payload Shape ----
export interface PlatformEvent<T = Record<string, unknown>> {
  eventType: PlatformEventType;
  channelName: string;
  payload: T;
  entityType?: string;
  entityId?: string;
  citySlug?: string;
  priority?: number;
  publisherId?: string;
  expiresInSeconds?: number;
}
