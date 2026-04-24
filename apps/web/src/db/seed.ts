import 'dotenv/config';
import { eq, sql } from 'drizzle-orm';
import { db } from './index';
import { cities, clerkUsers, homeAvailability, homes } from './schema';

const popularDestinations = [
  {
    cityName: 'Paris',
    country: 'France',
    cityDescription:
      'Charming Haussmann apartments and Montmartre studios steps from the best bistros.',
    listingCount: 0,
  },
  {
    cityName: 'Barcelona',
    country: 'Spain',
    cityDescription: 'Modernist flats, rooftop terraces, and beach-side bungalows across the city.',
    listingCount: 0,
  },
  {
    cityName: 'Lisbon',
    country: 'Portugal',
    cityDescription: "Pastel-tiled townhouses and hilltop miradouro views in one of Europe's gems.",
    listingCount: 0,
  },
  {
    cityName: 'Tokyo',
    country: 'Japan',
    cityDescription: 'Traditional machiya, minimalist apartments, and quiet garden retreats.',
    listingCount: 0,
  },
  {
    cityName: 'New York',
    country: 'United States',
    cityDescription: 'Brooklyn brownstones, Manhattan lofts, and Upper West Side classic sixes.',
    listingCount: 0,
  },
  {
    cityName: 'Amsterdam',
    country: 'Netherlands',
    cityDescription: 'Canal-front townhouses and creative Jordaan-neighbourhood flats.',
    listingCount: 0,
  },
];

type HomeTemplate = {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
};

const homeAdjectives = ['Spacious', 'Sunny', 'Peaceful', 'Modern', 'Charming', 'Stylish'];
const homeStyles = ['cozy', 'elegant', 'bright', 'urban', 'tranquil', 'contemporary'];
const homeAreas = [
  'midtown',
  'riverside',
  'old town',
  'city-center',
  'arts district',
  'historic quarter',
];

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateHomeDescription(city: string) {
  const adjective = pickRandom(homeAdjectives);
  const style = pickRandom(homeStyles);
  const area = pickRandom(homeAreas);
  const noun = Math.random() > 0.5 ? 'home' : 'apartment';
  return `${adjective} and ${style} ${area} ${city} ${noun}`;
}

const homeTemplates: HomeTemplate[] = [
  { bedrooms: 1, bathrooms: 1, maxGuests: 2, amenities: ['wifi', 'ac', 'washing_machine'] },
  {
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ['wifi', 'pet_friendly', 'washing_machine', 'dishwasher'],
  },
  {
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: ['wifi', 'ac', 'parking', 'washing_machine', 'dishwasher'],
  },
  { bedrooms: 1, bathrooms: 1, maxGuests: 2, amenities: ['wifi', 'pet_friendly'] },
  {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 5,
    amenities: ['wifi', 'ac', 'parking', 'washing_machine', 'dishwasher'],
  },
  {
    bedrooms: 4,
    bathrooms: 2,
    maxGuests: 8,
    amenities: ['wifi', 'ac', 'parking', 'pet_friendly', 'washing_machine', 'dishwasher'],
  },
  { bedrooms: 1, bathrooms: 1, maxGuests: 3, amenities: ['wifi', 'washing_machine'] },
  {
    bedrooms: 3,
    bathrooms: 1,
    maxGuests: 5,
    amenities: ['wifi', 'ac', 'pet_friendly', 'dishwasher'],
  },
];

function pickHomes(count: number) {
  const shuffled = [...homeTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateAvailabilityRanges(homeId: number) {
  const count = 1 + Math.floor(Math.random() * 3); // 1–3
  const ranges: { homeId: number; startDate: string; endDate: string }[] = [];
  // Start from a random offset in the next 0–30 days
  let cursor = addDays(new Date(), Math.floor(Math.random() * 30));
  for (let i = 0; i < count; i++) {
    const start = cursor;
    const duration = 7 + Math.floor(Math.random() * 22); // 7–28 days long
    const end = addDays(start, duration);
    ranges.push({ homeId, startDate: toDateString(start), endDate: toDateString(end) });
    // Gap of 3–10 days before the next range
    cursor = addDays(end, 3 + Math.floor(Math.random() * 8));
  }
  return ranges;
}

async function main() {
  const users = await db.select({ clerkUserId: clerkUsers.clerkUserId }).from(clerkUsers);

  // Seed cities if not present
  let cityRows = await db
    .select({ id: cities.id, cityName: cities.cityName, country: cities.country })
    .from(cities);
  if (cityRows.length === 0) {
    cityRows = await db.insert(cities).values(popularDestinations).returning({
      id: cities.id,
      cityName: cities.cityName,
      country: cities.country,
    });
    console.info('Seeded popular destination cities.');
  } else {
    console.info('Cities already exist, skipping city seed.');
  }

  // Seed homes if not present
  const existingHomes = await db.select({ id: homes.id, ownerId: homes.ownerId }).from(homes);
  if (existingHomes.length > 0) {
    await db
      .update(homes)
      .set({ description: sql`concat('Charming and cozy ', city, ' home')` })
      .where(eq(homes.description, ''));
    console.info('Homes already exist. Backfilled missing descriptions.');

    if (users.length > 0) {
      for (const home of existingHomes) {
        if (!home.ownerId) {
          await db
            .update(homes)
            .set({ ownerId: pickRandom(users).clerkUserId })
            .where(eq(homes.id, home.id));
        }
      }
      console.info('Backfilled missing home owners from existing Clerk users.');
    }

    // Seed availability if none exist yet
    const existingAvailability = await db
      .select({ id: homeAvailability.id })
      .from(homeAvailability)
      .limit(1);
    if (existingAvailability.length === 0) {
      const availabilityRows = existingHomes.flatMap((h) => generateAvailabilityRanges(h.id));
      await db.insert(homeAvailability).values(availabilityRows);
      console.info(
        `Seeded ${availabilityRows.length} availability ranges for ${existingHomes.length} homes.`,
      );
    } else {
      console.info('Availability already exists, skipping.');
    }
    return;
  }

  for (const city of cityRows) {
    const count = 5 + Math.floor(Math.random() * 4); // 5–8
    const templates = pickHomes(count);
    const rows = templates.map((t) => ({
      ...t,
      cityId: city.id,
      city: city.cityName,
      country: city.country,
      description: generateHomeDescription(city.cityName),
      ownerId: users.length > 0 ? pickRandom(users).clerkUserId : null,
    }));
    await db.insert(homes).values(rows);
    await db
      .update(cities)
      .set({ listingCount: sql`(select count(*) from homes where city_id = ${city.id})` })
      .where(eq(cities.id, city.id));
    console.info(`  ${city.cityName}: inserted ${count} homes, updated listing_count.`);
  }

  // Seed availability ranges for all homes
  const allHomes = await db.select({ id: homes.id }).from(homes);
  const availabilityRows = allHomes.flatMap((h) => generateAvailabilityRanges(h.id));
  if (availabilityRows.length > 0) {
    await db.insert(homeAvailability).values(availabilityRows);
    console.info(
      `Seeded ${availabilityRows.length} availability ranges for ${allHomes.length} homes.`,
    );
  }

  console.info('Homes seeded successfully.');
}

main().catch((error) => {
  console.error('Database seed failed.');
  console.error(error);
  process.exit(1);
});
