/** Sentinel option in location pickers — not a DB row. */
export const ALL_LOCATIONS_LABEL = 'All Locations';

/**
 * @deprecated Use /api/v1/locations (areas table). Kept as empty for any
 * leftover imports — never seed fake place names into the UI.
 */
export const CALICUT_LOCATIONS = [ALL_LOCATIONS_LABEL] as const;

export const BUSINESS_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid' },
  { id: 'restaurants', name: 'Dining & Cafes', icon: 'Utensils' },
  { id: 'shopping', name: 'Textiles & Shopping', icon: 'ShoppingBag' },
  { id: 'health', name: 'Hospitals & Clinics', icon: 'Activity' },
  { id: 'services', name: 'Home & Auto Services', icon: 'Wrench' },
  { id: 'tech', name: 'IT & Cyberpark Firms', icon: 'Laptop' },
  { id: 'education', name: 'Colleges & Tuition', icon: 'GraduationCap' },
  { id: 'real_estate', name: 'Properties & Rent', icon: 'Building2' },
  { id: 'travel', name: 'Travel & Resorts', icon: 'Compass' },
] as const;

export const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'walk_in', label: 'Walk-In Interview' },
  { value: 'gig', label: 'Gig / Delivery' },
  { value: 'freelance', label: 'Freelance / Contract' },
] as const;

export const MARKETPLACE_CONDITIONS = [
  { value: 'new', label: 'Brand New' },
  { value: 'like_new', label: 'Like New (Unused)' },
  { value: 'used', label: 'Pre-owned / Used' },
] as const;
