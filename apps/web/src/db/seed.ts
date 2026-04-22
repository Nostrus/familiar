import 'dotenv/config';
import { db } from './index';
import { cities } from './schema';

const popularDestinations = [
  {
    cityName: 'Paris',
    country: 'France',
    cityDescription:
      'Charming Haussmann apartments and Montmartre studios steps from the best bistros.',
    listingCount: 382,
  },
  {
    cityName: 'Barcelona',
    country: 'Spain',
    cityDescription: 'Modernist flats, rooftop terraces, and beach-side bungalows across the city.',
    listingCount: 294,
  },
  {
    cityName: 'Lisbon',
    country: 'Portugal',
    cityDescription: "Pastel-tiled townhouses and hilltop miradouro views in one of Europe's gems.",
    listingCount: 211,
  },
  {
    cityName: 'Tokyo',
    country: 'Japan',
    cityDescription: 'Traditional machiya, minimalist apartments, and quiet garden retreats.',
    listingCount: 187,
  },
  {
    cityName: 'New York',
    country: 'United States',
    cityDescription: 'Brooklyn brownstones, Manhattan lofts, and Upper West Side classic sixes.',
    listingCount: 425,
  },
  {
    cityName: 'Amsterdam',
    country: 'Netherlands',
    cityDescription: 'Canal-front townhouses and creative Jordaan-neighbourhood flats.',
    listingCount: 163,
  },
];

async function main() {
  const existingCities = await db.select({ id: cities.id }).from(cities).limit(1);

  if (existingCities.length > 0) {
    console.info('Cities already exist. Seed skipped.');
    return;
  }

  await db.insert(cities).values(popularDestinations);
  console.info('Seeded popular destination cities.');
}

main().catch((error) => {
  console.error('Database seed failed.');
  console.error(error);
  process.exit(1);
});
