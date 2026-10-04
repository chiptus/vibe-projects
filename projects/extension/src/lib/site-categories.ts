export interface SiteCategoryDef {
  label: string;
  description: string;
}

// Labels must match Preset.category values in presets.ts so a detected
// category can filter the preset list directly.
export const SITE_CATEGORIES: SiteCategoryDef[] = [
  {
    label: 'Booking.com',
    description: 'Hotel, travel, or accommodation booking and review sites',
  },
  {
    label: 'News sites',
    description: 'News articles and journalism',
  },
  {
    label: 'Any page',
    description: 'Anything else not covered by the other categories',
  },
];
