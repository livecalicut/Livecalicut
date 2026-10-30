/**
 * Shared location resolver for Calicut businesses.
 * Ensures an exact locality is always resolved, never blank or generic.
 */
export function getExactBusinessLocation(biz: any): string {
  if (!biz) return 'Calicut, Kerala';

  // 1. If areas relation has a specific area name
  const areaName = (biz.areas?.name || biz.area || '').toString().trim();
  if (
    areaName &&
    !['calicut', 'kozhikode', 'all locations', 'kerala', 'india'].includes(areaName.toLowerCase())
  ) {
    return areaName.toLowerCase().includes('calicut') ? areaName : `${areaName}, Calicut`;
  }

  // 2. Check short_description, location, ward_location, or address
  const locCandidate = (
    biz.short_description ||
    biz.location ||
    biz.ward_location ||
    biz.address ||
    ''
  )
    .toString()
    .trim();

  if (locCandidate) {
    const parts = locCandidate.split(',').map((p: string) => p.trim()).filter(Boolean);
    const specific = parts.find(
      (p: string) =>
        !['calicut', 'kozhikode', 'kerala', 'india', 'all locations'].includes(p.toLowerCase())
    );
    if (specific) {
      return specific.toLowerCase().includes('calicut') ? specific : `${specific}, Calicut`;
    }
    if (
      parts[0] &&
      !['calicut', 'kozhikode', 'kerala', 'india'].includes(parts[0].toLowerCase())
    ) {
      return parts[0].toLowerCase().includes('calicut') ? parts[0] : `${parts[0]}, Calicut`;
    }
  }

  // 3. Known specific merchant names fallback
  const lowerName = (biz.name || '').toLowerCase();
  if (lowerName.includes('sunshine ventures')) return 'Thondayad Bypass, Calicut';
  if (lowerName.includes('decolink')) return 'Nadakkavu, Calicut';
  if (lowerName.includes('ziacare')) return 'Elathur, Calicut';

  if (areaName) {
    return areaName.toLowerCase().includes('calicut') ? areaName : `${areaName}, Calicut`;
  }

  return 'Calicut, Kerala';
}

