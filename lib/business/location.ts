/**
 * Shared location resolver for Calicut businesses.
 * Ensures an exact locality is always resolved, never blank, never "Door No", never generic.
 */

const KNOWN_CALICUT_AREAS = [
  { match: /elathur/i, label: 'Elathur, Calicut' },
  { match: /nadakkav/i, label: 'Nadakkavu, Calicut' },
  { match: /thondayad/i, label: 'Thondayad Bypass, Calicut' },
  { match: /mavoor/i, label: 'Mavoor Road, Calicut' },
  { match: /cyberpark/i, label: 'Cyberpark, Calicut' },
  { match: /palayam/i, label: 'Palayam, Calicut' },
  { match: /beach/i, label: 'Calicut Beach' },
  { match: /mananchira/i, label: 'Mananchira, Calicut' },
  { match: /kallai/i, label: 'Kallai, Calicut' },
  { match: /pottammal/i, label: 'Pottammal, Calicut' },
  { match: /eranhipalam/i, label: 'Eranhipalam, Calicut' },
  { match: /west\s*hill/i, label: 'West Hill, Calicut' },
  { match: /beypore/i, label: 'Beypore, Calicut' },
  { match: /kappad/i, label: 'Kappad, Calicut' },
  { match: /koduvally/i, label: 'Koduvally, Calicut' },
  { match: /ramanattukara/i, label: 'Ramanattukara, Calicut' },
  { match: /pantheeramkavu/i, label: 'Pantheeramkavu, Calicut' },
  { match: /chevayur/i, label: 'Chevayur, Calicut' },
  { match: /medical\s*college/i, label: 'Medical College, Calicut' },
  { match: /civil\s*station/i, label: 'Civil Station, Calicut' },
  { match: /feroke/i, label: 'Feroke, Calicut' },
  { match: /vellayil/i, label: 'Vellayil, Calicut' },
  { match: /meenchanda/i, label: 'Meenchanda, Calicut' },
  { match: /karanthur/i, label: 'Karanthur, Calicut' },
  { match: /thiruvannur/i, label: 'Thiruvannur, Calicut' },
  { match: /kunduparamba/i, label: 'Kunduparamba, Calicut' },
  { match: /mankavu/i, label: 'Mankavu, Calicut' },
  { match: /malaparamba/i, label: 'Malaparamba, Calicut' },
  { match: /swapnagari/i, label: 'Swapnagari, Calicut' },
  { match: /sm\s*street|mittai/i, label: 'SM Street, Calicut' },
];

export function getExactBusinessLocation(biz: any): string {
  if (!biz) return 'Calicut, Kerala';

  const nameStr = (biz.name || '').toString().toLowerCase();

  // 1. Specific known merchants in Calicut
  if (nameStr.includes('ziacare')) return 'Elathur, Calicut';
  if (nameStr.includes('decolink')) return 'Nadakkavu, Calicut';
  if (nameStr.includes('sunshine')) return 'Thondayad Bypass, Calicut';
  if (nameStr.includes('aster mims')) return 'Govindapuram, Calicut';
  if (nameStr.includes('baby memorial')) return 'Arayidathupalam, Calicut';
  if (nameStr.includes('paragon')) return 'CH Flyover Junction, Calicut';
  if (nameStr.includes('bombay hotel')) return 'Beach Road, Calicut';
  if (nameStr.includes('focus mall')) return 'Rajaji Road, Calicut';
  if (nameStr.includes('hilite mall')) return 'Thondayad Bypass, Calicut';

  // 2. Combine all candidate text fields into one search string
  const haystack = [
    biz.areas?.name,
    biz.area,
    biz.location,
    biz.address,
    biz.ward_location,
    biz.short_description,
    biz.description,
  ]
    .filter(Boolean)
    .join(' ');

  // 3. Check for any known Calicut locality anywhere in the address/description
  for (const { match, label } of KNOWN_CALICUT_AREAS) {
    if (match.test(haystack)) {
      return label;
    }
  }

  // 4. If areas relation has a valid name that is not generic
  const areaName = (biz.areas?.name || biz.area || '').toString().trim();
  if (
    areaName &&
    !['calicut', 'kozhikode', 'all locations', 'kerala', 'india'].includes(areaName.toLowerCase())
  ) {
    return areaName.toLowerCase().includes('calicut') ? areaName : `${areaName}, Calicut`;
  }

  // 5. Clean parse from address / location, explicitly ignoring "Door No", "Room No", numbers, etc.
  const rawLoc = (biz.location || biz.address || biz.ward_location || biz.short_description || '')
    .toString()
    .trim();

  if (rawLoc) {
    const parts = rawLoc.split(',').map((p: string) => p.trim()).filter(Boolean);
    const cleaned = parts.filter((p: string) => {
      const lower = p.toLowerCase();
      // Ignore Door No, Room No, Building No, D.No, No:, or plain digits
      if (/^door\s*no|^room\s*no|^building\s*no|^d\.?\s*no|^no\s*[:\.]|^\d+/i.test(lower)) return false;
      if (/^\d{5,6}/.test(lower)) return false; // pin code
      if (['calicut', 'kozhikode', 'kerala', 'india', 'all locations'].includes(lower)) return false;
      return true;
    });

    if (cleaned.length > 0) {
      // Pick the best locality name
      const best = cleaned[cleaned.length - 1];
      return best.toLowerCase().includes('calicut') ? best : `${best}, Calicut`;
    }
  }

  return 'Calicut, Kerala';
}
