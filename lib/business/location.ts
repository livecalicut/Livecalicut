/**
 * Shared location resolver for Calicut businesses.
 * Respects the user's exact entered address/location with top priority,
 * preventing accidental or forced "Calicut" appends to out-of-district or custom places.
 */

const KNOWN_CALICUT_AREAS = [
  { match: /\belathur\b/i, label: 'Elathur, Calicut' },
  { match: /\bnadakkav\b|\bnadakkavu\b/i, label: 'Nadakkavu, Calicut' },
  { match: /\bthondayad\b/i, label: 'Thondayad Bypass, Calicut' },
  { match: /\bmavoor\s*road\b/i, label: 'Mavoor Road, Calicut' },
  { match: /\bcyberpark\b/i, label: 'Cyberpark, Calicut' },
  { match: /\bpalayam\b/i, label: 'Palayam, Calicut' },
  { match: /\bcalicut\s*beach\b|\bbeach\s*road\b/i, label: 'Calicut Beach' },
  { match: /\bmananchira\b/i, label: 'Mananchira, Calicut' },
  { match: /\bkallai\b/i, label: 'Kallai, Calicut' },
  { match: /\bpottammal\b/i, label: 'Pottammal, Calicut' },
  { match: /\beranhipalam\b/i, label: 'Eranhipalam, Calicut' },
  { match: /\bwest\s*hill\b/i, label: 'West Hill, Calicut' },
  { match: /\bbeypore\b/i, label: 'Beypore, Calicut' },
  { match: /\bkappad\b/i, label: 'Kappad, Calicut' },
  { match: /\bkoduvally\b/i, label: 'Koduvally, Calicut' },
  { match: /\bramanattukara\b/i, label: 'Ramanattukara, Calicut' },
  { match: /\bpantheeramkavu\b/i, label: 'Pantheeramkavu, Calicut' },
  { match: /\bchevayur\b/i, label: 'Chevayur, Calicut' },
  { match: /\bmedical\s*college\b/i, label: 'Medical College, Calicut' },
  { match: /\bcivil\s*station\b/i, label: 'Civil Station, Calicut' },
  { match: /\bferoke\b/i, label: 'Feroke, Calicut' },
  { match: /\bvellayil\b/i, label: 'Vellayil, Calicut' },
  { match: /\bmeenchanda\b/i, label: 'Meenchanda, Calicut' },
  { match: /\bkaranthur\b/i, label: 'Karanthur, Calicut' },
  { match: /\bthiruvannur\b/i, label: 'Thiruvannur, Calicut' },
  { match: /\bkunduparamba\b/i, label: 'Kunduparamba, Calicut' },
  { match: /\bmankavu\b/i, label: 'Mankavu, Calicut' },
  { match: /\bmalaparamba\b/i, label: 'Malaparamba, Calicut' },
  { match: /\bswapnagari\b/i, label: 'Swapnagari, Calicut' },
  { match: /\bsm\s*street\b|\bmittai\b/i, label: 'SM Street, Calicut' },
];

/**
 * Clean up an address string for display:
 * Strips door/room numbers, building prefixes, pin codes, but preserves the real locality & district.
 */
function cleanAddress(raw: string): string {
  if (!raw) return '';
  let str = raw.trim();

  // Strip Door No, Room No, Building No, Shop No prefixes: e.g. "Door No: 12/34, Main Road, Vengara" -> "Main Road, Vengara"
  str = str.replace(/^(?:door\s*no\.?|room\s*no\.?|building\s*no\.?|bldg\s*no\.?|d\.?\s*no\.?|shop\s*no\.?|no\s*[:\.]?)\s*[^,]+,\s*/i, '');
  // Strip leading standalone numbers or alphanumeric door codes: e.g. "12/432, " or "4-A, "
  str = str.replace(/^\d+[\w\/-]*,\s*/i, '');
  // Strip pin codes at end or inside: e.g. "676304", "673001"
  str = str.replace(/,\s*(?:kerala\s*)?\b\d{6}\b.*$/i, '');
  str = str.replace(/\b\d{6}\b/g, '').trim();
  // Clean up trailing and leading punctuation/spaces
  str = str.replace(/^[, -]+|[, -]+$/g, '').trim();

  return str;
}

export function getExactBusinessLocation(biz: any): string {
  if (!biz) return 'Calicut, Kerala';

  // 1. PRIORITY 1: Explicit user/merchant address or location field.
  // Whatever correct address the merchant or user provided must be preserved and shown.
  const rawAddressCandidates = [
    biz.address,
    biz.location,
    biz.ward_location,
    typeof biz.short_description === 'string' &&
    biz.short_description.length <= 80 &&
    !biz.short_description.includes('.')
      ? biz.short_description
      : null,
  ].filter(Boolean);

  for (const candidate of rawAddressCandidates) {
    const cleaned = cleanAddress(String(candidate));
    if (cleaned && !['calicut', 'kozhikode', 'all locations', 'kerala', 'india'].includes(cleaned.toLowerCase())) {
      return cleaned;
    }
  }

  // 2. PRIORITY 2: Check area name
  const areaName = (biz.areas?.name || biz.area || '').toString().trim();
  if (
    areaName &&
    !['calicut', 'kozhikode', 'all locations', 'kerala', 'india'].includes(areaName.toLowerCase())
  ) {
    // If it's a known Calicut locality, append ", Calicut" only if not already containing Calicut or Kozhikode
    const isCalicutArea = KNOWN_CALICUT_AREAS.some((k) => k.match.test(areaName));
    if (isCalicutArea && !/calicut|kozhikode/i.test(areaName)) {
      return `${areaName}, Calicut`;
    }
    // For non-Calicut places (e.g. "Vengara", "Malappuram", "Koyilandy", "Kondotty"), preserve as is!
    return areaName;
  }

  // 3. PRIORITY 3: Known merchant brand names in Calicut (fallback only when no address/area provided)
  const nameStr = (biz.name || '').toString().toLowerCase();
  if (nameStr.includes('ziacare')) return 'Elathur, Calicut';
  if (nameStr.includes('decolink')) return 'Nadakkavu, Calicut';
  if (nameStr.includes('sunshine')) return 'Thondayad Bypass, Calicut';
  if (nameStr.includes('aster mims')) return 'Govindapuram, Calicut';
  if (nameStr.includes('baby memorial')) return 'Arayidathupalam, Calicut';
  if (nameStr.includes('paragon')) return 'CH Flyover Junction, Calicut';
  if (nameStr.includes('bombay hotel')) return 'Beach Road, Calicut';
  if (nameStr.includes('focus mall')) return 'Rajaji Road, Calicut';
  if (nameStr.includes('hilite mall')) return 'Thondayad Bypass, Calicut';

  // 4. PRIORITY 4: Check if any known Calicut area is mentioned in haystack description
  const haystack = [
    biz.description,
    biz.short_description,
  ].filter(Boolean).join(' ');

  for (const { match, label } of KNOWN_CALICUT_AREAS) {
    if (match.test(haystack)) {
      return label;
    }
  }

  return 'Calicut, Kerala';
}
