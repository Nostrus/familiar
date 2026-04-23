import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const clerkUsers = pgTable('clerk_users', {
  clerkUserId: text('clerk_user_id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  cityName: text('city_name').notNull(),
  country: text('country').notNull(),
  cityDescription: text('city_description').notNull(),
  listingCount: integer('listing_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const homes = pgTable('homes', {
  id: serial('id').primaryKey(),
  cityId: integer('city_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  city: text('city').notNull(),
  country: text('country').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  maxGuests: integer('max_guests').notNull(),
  amenities: text('amenities').array().default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type City = typeof cities.$inferSelect;
export type Home = typeof homes.$inferSelect;
export type User = typeof clerkUsers.$inferSelect;
