export const AMENITIES = {
  wifi: { key: 'wifi', label: 'WiFi', webIcon: 'Wifi', mobileIcon: 'wifi' },
  ac: { key: 'ac', label: 'Air Conditioning', webIcon: 'Wind', mobileIcon: 'wind' },
  parking: { key: 'parking', label: 'Parking', webIcon: 'Car', mobileIcon: 'truck' },
  pet_friendly: {
    key: 'pet_friendly',
    label: 'Pet Friendly',
    webIcon: 'PawPrint',
    mobileIcon: 'heart',
  },
  washing_machine: {
    key: 'washing_machine',
    label: 'Washing Machine',
    webIcon: 'WashingMachine',
    mobileIcon: 'refresh-cw',
  },
  dishwasher: {
    key: 'dishwasher',
    label: 'Dishwasher',
    webIcon: 'UtensilsCrossed',
    mobileIcon: 'coffee',
  },
} as const;

export type AmenityKey = keyof typeof AMENITIES;

export function getAmenityLabel(key: string): string {
  if (key in AMENITIES) {
    return AMENITIES[key as AmenityKey].label;
  }
  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
