/** Sentinel option in location pickers — not a DB row. */
export const ALL_LOCATIONS_LABEL = 'All Locations';

/** LiveCalicut desk WhatsApp. Digits only, with India country code. */
export const SITE_WHATSAPP_E164 = '919539980990';
export const SITE_WHATSAPP_DISPLAY = '+91 95399 80990';

export function siteWhatsAppHref(message?: string) {
  const base = `https://wa.me/${SITE_WHATSAPP_E164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Used when the areas API is empty or unreachable, so the location picker still works. */
export const KOZHIKODE_AREAS: { id: string; name: string; slug: string; pincode: string }[] = [
  { id: 'area-beypore', name: 'Beypore', slug: 'beypore', pincode: '673015' },
  { id: 'area-chevayur', name: 'Chevayur', slug: 'chevayur', pincode: '673017' },
  { id: 'area-cyberpark', name: 'Cyberpark', slug: 'cyberpark', pincode: '673016' },
  { id: 'area-eranhipalam', name: 'Eranhipalam', slug: 'eranhipalam', pincode: '673006' },
  { id: 'area-kallai', name: 'Kallai', slug: 'kallai', pincode: '673003' },
  { id: 'area-karaparamba', name: 'Karaparamba', slug: 'karaparamba', pincode: '673010' },
  { id: 'area-kottooli', name: 'Kottooli', slug: 'kottooli', pincode: '673016' },
  { id: 'area-beach', name: 'Calicut Beach', slug: 'kozhikode-beach', pincode: '673032' },
  { id: 'area-malaparamba', name: 'Malaparamba', slug: 'malaparamba', pincode: '673009' },
  { id: 'area-mavoor', name: 'Mavoor Road', slug: 'mavoor-road', pincode: '673004' },
  { id: 'area-medical', name: 'Medical College', slug: 'medical-college', pincode: '673008' },
  { id: 'area-nadakkavu', name: 'Nadakkavu', slug: 'nadakkavu', pincode: '673011' },
  { id: 'area-palayam', name: 'Palayam', slug: 'palayam', pincode: '673002' },
  { id: 'area-pantheerankavu', name: 'Pantheerankavu', slug: 'pantheerankavu', pincode: '673019' },
  { id: 'area-puthiyara', name: 'Puthiyara', slug: 'puthiyara', pincode: '673004' },
  { id: 'area-sm', name: 'SM Street', slug: 'sm-street', pincode: '673001' },
  { id: 'area-thondayad', name: 'Thondayad', slug: 'thondayad', pincode: '673017' },
  { id: 'area-vellayil', name: 'Vellayil', slug: 'vellayil', pincode: '673032' },
  { id: 'area-vengeri', name: 'Vengeri', slug: 'vengeri', pincode: '673010' },
  { id: 'area-westhill', name: 'West Hill', slug: 'west-hill', pincode: '673005' },
];

/**
 * @deprecated Use /api/v1/locations (areas table). Kept as empty for any
 * leftover imports — never seed fake place names into the UI.
 */
export const CALICUT_LOCATIONS = [ALL_LOCATIONS_LABEL] as const;

export const BUSINESS_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid' },
  { id: 'restaurants-cafes', name: 'Restaurants & Cafés', icon: 'Utensils' },
  { id: 'tourism-destinations', name: 'Tourism & Destinations', icon: 'Palmtree' },
  { id: 'lifestyle-wellness', name: 'Lifestyle & Wellness', icon: 'Sparkles' },
  { id: 'shopping-entertainment', name: 'Shopping & Entertainment', icon: 'ShoppingBag' },
  { id: 'arts-culture', name: 'Arts & Culture', icon: 'Palette' },
  { id: 'business-directory', name: 'Business Directory', icon: 'Building2' },
  { id: 'local-services', name: 'Local Services', icon: 'Wrench' },
  { id: 'classifieds', name: 'Classifieds', icon: 'Tag' },
  { id: 'properties', name: 'Properties', icon: 'Home' },
  { id: 'featured-businesses', name: 'Featured Businesses', icon: 'Crown' },
  { id: 'jobs-careers', name: 'Jobs & Careers', icon: 'Briefcase' },
  { id: 'internships', name: 'Internships', icon: 'GraduationCap' },
  { id: 'education-courses', name: 'Education & Courses', icon: 'BookOpen' },
  { id: 'startups-creators', name: 'Startups & Creators', icon: 'Rocket' },
  { id: 'community-stories', name: 'Community Stories', icon: 'Newspaper' },
  { id: 'traffic-transport', name: 'Traffic & Transport', icon: 'Bus' },
  { id: 'sports-activities', name: 'Sports & Activities', icon: 'Trophy' },
  { id: 'local-initiatives', name: 'Local Initiatives', icon: 'HeartHandshake' },
  { id: 'public-announcements', name: 'Public Announcements', icon: 'Megaphone' },
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
