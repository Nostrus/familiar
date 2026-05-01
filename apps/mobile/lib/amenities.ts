import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export const AMENITIES = {
  wifi: {
    key: 'wifi',
    label: 'WiFi',
    icon: 'wifi' as FeatherIconName,
  },
  ac: {
    key: 'ac',
    label: 'Air Conditioning',
    icon: 'wind' as FeatherIconName,
  },
  parking: {
    key: 'parking',
    label: 'Parking',
    icon: 'truck' as FeatherIconName,
  },
  pet_friendly: {
    key: 'pet_friendly',
    label: 'Pet Friendly',
    icon: 'heart' as FeatherIconName,
  },
  washing_machine: {
    key: 'washing_machine',
    label: 'Washing Machine',
    icon: 'refresh-cw' as FeatherIconName,
  },
  dishwasher: {
    key: 'dishwasher',
    label: 'Dishwasher',
    icon: 'coffee' as FeatherIconName,
  },
} as const;

export type AmenityKey = keyof typeof AMENITIES;

function toLabel(key: string) {
  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getAmenity(key: string) {
  return AMENITIES[key as AmenityKey] || { key, label: toLabel(key), icon: null };
}
