import { date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const clerkUsers = pgTable('clerk_users', {
  clerkUserId: text('clerk_user_id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
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
  ownerId: text('owner_id').references(() => clerkUsers.clerkUserId, {
    onDelete: 'set null',
  }),
  cityId: integer('city_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  city: text('city').notNull(),
  country: text('country').notNull(),
  description: text('description').default('').notNull(),
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

export const homeAvailability = pgTable('home_availability', {
  id: serial('id').primaryKey(),
  homeId: integer('home_id')
    .notNull()
    .references(() => homes.id, { onDelete: 'cascade' }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type HomeAvailability = typeof homeAvailability.$inferSelect;

export const homeStayRequests = pgTable('home_stay_requests', {
  id: serial('id').primaryKey(),
  homeId: integer('home_id')
    .notNull()
    .references(() => homes.id, { onDelete: 'cascade' }),
  requesterId: text('requester_id')
    .notNull()
    .references(() => clerkUsers.clerkUserId, { onDelete: 'cascade' }),
  requestedStartDate: date('requested_start_date').notNull(),
  requestedEndDate: date('requested_end_date').notNull(),
  status: text('status').$type<'pending' | 'approved' | 'rejected'>().default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type HomeStayRequest = typeof homeStayRequests.$inferSelect;
