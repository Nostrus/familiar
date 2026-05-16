import 'server-only';

import type { Home, HomesByCity } from '@org/types';
import { and, gte, inArray, lte } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../client';
import { homeAvailability, homes } from '../schema';

export type HomesByCityFilters = {
  cities?: string[];
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
};

export const getHomesByCity = cache(
  async (filters: HomesByCityFilters = {}): Promise<HomesByCity<Home>> => {
    const conditions = [];

    if (filters.cities && filters.cities.length > 0) {
      conditions.push(inArray(homes.city, filters.cities));
    }

    if (filters.guests && filters.guests > 0) {
      conditions.push(gte(homes.maxGuests, filters.guests));
    }

    if (filters.dateFrom || filters.dateTo) {
      const availConditions = [];

      if (filters.dateFrom) {
        availConditions.push(gte(homeAvailability.endDate, filters.dateFrom));
      }
      if (filters.dateTo) {
        availConditions.push(lte(homeAvailability.startDate, filters.dateTo));
      }
      const availRows = await db
        .selectDistinct({ homeId: homeAvailability.homeId })
        .from(homeAvailability)
        .where(availConditions.length > 0 ? and(...availConditions) : undefined);

      const homeIds = availRows.map((r) => r.homeId);
      if (homeIds.length === 0) return {};

      conditions.push(inArray(homes.id, homeIds));
    }

    const rows = await db
      .select()
      .from(homes)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Group by city, top 5 per city
    const grouped: HomesByCity<Home> = {};
    for (const home of rows) {
      if (!grouped[home.city]) grouped[home.city] = [];
      if (grouped[home.city].length < 5) grouped[home.city].push(home);
    }

    return grouped;
  },
);
