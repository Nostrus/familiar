import { AMENITIES, getAmenityLabel } from '@org/types';
export type { AmenityKey } from '@org/types';

export { AMENITIES };

export function getAmenity(key: string) {
  const entry = AMENITIES[key as keyof typeof AMENITIES];
  if (entry) {
    return { key: entry.key, label: entry.label, icon: entry.mobileIcon };
  }
  return { key, label: getAmenityLabel(key), icon: null };
}
