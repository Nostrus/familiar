import { Car, PawPrint, UtensilsCrossed, WashingMachine, Wifi, Wind } from 'lucide-react';

export const AMENITIES = {
  wifi: {
    key: 'wifi',
    label: 'WiFi',
    icon: Wifi,
  },
  ac: {
    key: 'ac',
    label: 'Air Conditioning',
    icon: Wind,
  },
  parking: {
    key: 'parking',
    label: 'Parking',
    icon: Car,
  },
  pet_friendly: {
    key: 'pet_friendly',
    label: 'Pet Friendly',
    icon: PawPrint,
  },
  washing_machine: {
    key: 'washing_machine',
    label: 'Washing Machine',
    icon: WashingMachine,
  },
  dishwasher: {
    key: 'dishwasher',
    label: 'Dishwasher',
    icon: UtensilsCrossed,
  },
} as const;

export type AmenityKey = keyof typeof AMENITIES;

export function getAmenity(key: string) {
  return AMENITIES[key as AmenityKey] || { key, label: key, icon: null };
}
