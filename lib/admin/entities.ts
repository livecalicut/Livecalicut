// lib/admin/entities.ts
// Single source of truth for what admins may edit per entity. The update API
// uses it as an allow-list (and for type coercion); the admin edit forms use
// it to render inputs. Only columns that exist in production are listed.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'url'
  | 'date'
  | 'datetime'
  | 'select'
  | 'checkbox'
  | 'image'
  | 'images';

export type EntityField = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Spans both columns in the two-column form grid */
  wide?: boolean;
  /** Upload module for image fields (see normalizeMediaModule) */
  module?: string;
};

export type EntityConfig = {
  table: string;
  label: string;
  roles: readonly string[];
  fields: EntityField[];
};

const opts = (...values: string[]) =>
  values.map((value) => ({
    value,
    label: value.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

const EDITORS = ['Super Admin', 'City Admin', 'Moderator'] as const;
const LISTING_EDITORS = ['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive'] as const;
const SUPER = ['Super Admin'] as const;
const CITY_AND_SUPER = ['Super Admin', 'City Admin'] as const;

const categoryFields: EntityField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, wide: true },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];

export const ADMIN_ENTITIES: Record<string, EntityConfig> = {
  business: {
    table: 'businesses',
    label: 'Business',
    roles: LISTING_EDITORS,
    fields: [
      { name: 'name', label: 'Business name', type: 'text', required: true, wide: true },
      { name: 'short_description', label: 'Short description', type: 'text', wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'google_maps_link', label: 'Google Maps link', type: 'url', wide: true },
      { name: 'status', label: 'Status', type: 'select', options: opts('active', 'pending', 'rejected') },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'is_verified', label: 'Verified', type: 'checkbox' },
    ],
  },
  job: {
    table: 'jobs',
    label: 'Job',
    roles: LISTING_EDITORS,
    fields: [
      { name: 'title', label: 'Job title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'requirements', label: 'Requirements', type: 'textarea', wide: true },
      { name: 'salary', label: 'Salary', type: 'text' },
      {
        name: 'salary_type',
        label: 'Salary type',
        type: 'select',
        options: opts('monthly', 'yearly', 'daily', 'hourly'),
      },
      {
        name: 'employment_type',
        label: 'Employment type',
        type: 'select',
        options: opts('full-time', 'part-time', 'internship', 'temporary', 'contract', 'freelance', 'walk-in', 'wfh'),
      },
      { name: 'experience', label: 'Experience', type: 'text' },
      { name: 'openings_count', label: 'Openings', type: 'number' },
      { name: 'application_deadline', label: 'Apply by', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: opts('published', 'draft', 'closed') },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'is_urgent', label: 'Urgent', type: 'checkbox' },
    ],
  },
  news: {
    table: 'news',
    label: 'Article',
    roles: EDITORS,
    fields: [
      { name: 'title', label: 'Headline', type: 'text', required: true, wide: true },
      { name: 'summary', label: 'Summary', type: 'textarea', wide: true },
      { name: 'content', label: 'Article body', type: 'textarea', required: true, wide: true },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'source', label: 'Source', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: opts('published', 'draft', 'archived') },
      { name: 'featured_image', label: 'Cover image', type: 'image', module: 'news', wide: true },
      { name: 'gallery', label: 'Gallery', type: 'images', module: 'news', wide: true },
    ],
  },
  event: {
    table: 'events',
    label: 'Event',
    roles: EDITORS,
    fields: [
      { name: 'title', label: 'Event title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'venue', label: 'Venue', type: 'text', wide: true },
      { name: 'start_date', label: 'Starts', type: 'datetime', required: true },
      { name: 'end_date', label: 'Ends', type: 'datetime', required: true },
      { name: 'registration_link', label: 'Registration link', type: 'url', wide: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: opts('published', 'draft', 'cancelled', 'archived'),
      },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'is_ticket_required', label: 'Ticket required', type: 'checkbox' },
      { name: 'banner', label: 'Banner image', type: 'image', module: 'event', wide: true },
      { name: 'gallery', label: 'Gallery', type: 'images', module: 'event', wide: true },
    ],
  },
  marketplace: {
    table: 'marketplace_items',
    label: 'Listing',
    roles: LISTING_EDITORS,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true },
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        options: opts('brand_new', 'like_new', 'used_good', 'used_fair'),
      },
      { name: 'status', label: 'Status', type: 'select', options: opts('active', 'sold', 'archived') },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'is_negotiable', label: 'Negotiable', type: 'checkbox' },
      { name: 'cover_image', label: 'Cover image', type: 'image', module: 'marketplace', wide: true },
      { name: 'gallery', label: 'Gallery', type: 'images', module: 'marketplace', wide: true },
    ],
  },
  property: {
    table: 'properties',
    label: 'Property',
    roles: LISTING_EDITORS,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      {
        name: 'listing_type',
        label: 'Listing type',
        type: 'select',
        options: opts('sell', 'rent', 'lease', 'buy'),
      },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true },
      { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
      { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
      { name: 'area_sqft', label: 'Area (sq ft)', type: 'number' },
      { name: 'address', label: 'Address', type: 'text', wide: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: opts('published', 'draft', 'sold', 'rented'),
      },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'cover_image', label: 'Cover image', type: 'image', module: 'property', wide: true },
      { name: 'gallery', label: 'Gallery', type: 'images', module: 'property', wide: true },
    ],
  },
  place: {
    table: 'places',
    label: 'Place',
    roles: EDITORS,
    fields: [
      { name: 'title', label: 'Name', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'opening_hours', label: 'Opening hours', type: 'text' },
      { name: 'entry_fee', label: 'Entry fee (₹)', type: 'number' },
      { name: 'contact_phone', label: 'Phone', type: 'text' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'google_maps_link', label: 'Google Maps link', type: 'url', wide: true },
      { name: 'status', label: 'Status', type: 'select', options: opts('active', 'inactive') },
      { name: 'is_featured', label: 'Featured', type: 'checkbox' },
      { name: 'is_free_entry', label: 'Free entry', type: 'checkbox' },
      { name: 'cover_image', label: 'Cover image', type: 'image', module: 'explore', wide: true },
      { name: 'gallery', label: 'Gallery', type: 'images', module: 'explore', wide: true },
    ],
  },
  area: {
    table: 'areas',
    label: 'Area',
    roles: SUPER,
    fields: [
      { name: 'name', label: 'Area name', type: 'text', required: true, wide: true },
      { name: 'pincode', label: 'Pincode', type: 'text' },
      { name: 'is_active', label: 'Active', type: 'checkbox' },
      { name: 'latitude', label: 'Latitude', type: 'number' },
      { name: 'longitude', label: 'Longitude', type: 'number' },
    ],
  },
  city: {
    table: 'cities',
    label: 'City',
    roles: SUPER,
    fields: [
      { name: 'name', label: 'City name', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: opts('active', 'inactive') },
      { name: 'is_active', label: 'Active', type: 'checkbox' },
    ],
  },
  business_category: { table: 'business_categories', label: 'Category', roles: CITY_AND_SUPER, fields: categoryFields },
  job_category: { table: 'job_categories', label: 'Category', roles: CITY_AND_SUPER, fields: categoryFields },
  news_category: { table: 'news_categories', label: 'Category', roles: CITY_AND_SUPER, fields: categoryFields },
  marketplace_category: {
    table: 'marketplace_categories',
    label: 'Category',
    roles: CITY_AND_SUPER,
    fields: categoryFields,
  },
  property_category: {
    table: 'property_categories',
    label: 'Category',
    roles: CITY_AND_SUPER,
    fields: categoryFields,
  },
  user: {
    table: 'profiles',
    label: 'User',
    roles: CITY_AND_SUPER,
    fields: [
      { name: 'full_name', label: 'Full name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'area', label: 'Area', type: 'text' },
      { name: 'bio', label: 'Bio', type: 'textarea', wide: true },
    ],
  },
};

/**
 * Coerces raw form values to column types and drops anything not in the
 * entity's allow-list. Returns an error message for invalid input.
 */
export function sanitizeEntityValues(
  config: EntityConfig,
  raw: Record<string, unknown>
): { values: Record<string, unknown> } | { error: string } {
  const values: Record<string, unknown> = {};

  for (const field of config.fields) {
    if (!(field.name in raw)) continue;
    const input = raw[field.name];
    const empty = input === '' || input === null || input === undefined;

    if (field.required && empty) return { error: `${field.label} is required` };

    switch (field.type) {
      case 'checkbox':
        values[field.name] = input === true || input === 'true';
        break;
      case 'number': {
        if (empty) {
          values[field.name] = null;
          break;
        }
        const n = Number(input);
        if (!Number.isFinite(n)) return { error: `${field.label} must be a number` };
        values[field.name] = n;
        break;
      }
      case 'select':
        if (empty) break;
        if (!field.options?.some((o) => o.value === input)) {
          return { error: `${field.label} has an invalid value` };
        }
        values[field.name] = input;
        break;
      case 'images': {
        const list = Array.isArray(input) ? input : [];
        if (!list.every((u) => typeof u === 'string' && /^https?:\/\//.test(u))) {
          return { error: `${field.label} must be a list of image URLs` };
        }
        values[field.name] = list.slice(0, 20);
        break;
      }
      case 'url':
      case 'image':
        if (empty) {
          values[field.name] = null;
          break;
        }
        if (typeof input !== 'string' || !/^https?:\/\//.test(input)) {
          return { error: `${field.label} must be a valid http(s) URL` };
        }
        values[field.name] = input.trim();
        break;
      case 'date':
      case 'datetime': {
        if (empty) {
          values[field.name] = null;
          break;
        }
        const d = new Date(String(input));
        if (Number.isNaN(d.getTime())) return { error: `${field.label} is not a valid date` };
        values[field.name] = field.type === 'date' ? String(input).slice(0, 10) : d.toISOString();
        break;
      }
      default:
        values[field.name] = empty ? null : String(input).trim().slice(0, 20000);
    }
  }

  return { values };
}
