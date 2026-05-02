import { AMENITIES, getAmenityLabel } from '@org/types';
import {
  Car,
  PawPrint,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';
export type { AmenityKey } from '@org/types';

const WEB_ICONS: Record<string, LucideIcon> = {
  Wifi,
  Wind,
  Car,
  PawPrint,
  WashingMachine,
  UtensilsCrossed,
};

export { AMENITIES };

export function getAmenity(key: string) {
  const entry = AMENITIES[key as keyof typeof AMENITIES];
  if (entry) {
    return { key: entry.key, label: entry.label, icon: WEB_ICONS[entry.webIcon] ?? null };
  }
  return { key, label: getAmenityLabel(key), icon: null };
}
