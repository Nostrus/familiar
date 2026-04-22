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

export type City = typeof cities.$inferSelect;
export type User = typeof clerkUsers.$inferSelect;
