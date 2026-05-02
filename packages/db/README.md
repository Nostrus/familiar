# @org/db

Drizzle ORM schema, queries, and migrations for the Familiar platform (Neon PostgreSQL).

## Structure

- `src/schema.ts` — Table definitions
- `src/queries/` — Typed query functions used by the web API routes
- `src/scripts/` — Seed and backfill scripts
- `drizzle/` — Migration SQL files (auto-generated)

## Schema Tables

| Table                | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| `clerk_users`        | User records synced from Clerk webhooks                                    |
| `cities`             | Popular destination cities                                                 |
| `homes`              | Home listings with amenities, photos, and owner reference                  |
| `home_availability`  | Available date ranges per home                                             |
| `home_stay_requests` | Stay requests between guests and hosts (`pending \| approved \| rejected`) |
| `home_favorites`     | Per-user favorited homes                                                   |

## Available Queries (`src/queries/`)

| File                            | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `get-cities.ts`                 | List all cities                                           |
| `get-homes-by-city.ts`          | Browse homes filtered by city                             |
| `get-featured-homes.ts`         | Featured home listings                                    |
| `get-home.ts`                   | Single home detail with availability                      |
| `get-my-favorite-homes.ts`      | Authenticated user's favorites                            |
| `toggle-home-favorite.ts`       | Add or remove a favorite                                  |
| `get-my-stay-requests.ts`       | Outgoing requests for a guest                             |
| `get-stay-requests.ts`          | Core stay-request query (supports guest or owner filters) |
| `get-incoming-requests.ts`      | Incoming requests for a host                              |
| `create-stay-request.ts`        | Create a new stay request                                 |
| `update-stay-request-status.ts` | Approve or reject a request                               |
| `cancel-stay-request.ts`        | Cancel a pending request (requester only)                 |
| `update-owned-home.ts`          | Update a home's editable fields                           |

## Commands

Run from the repository root:

```sh
pnpm run db:generate              # Generate migration files from schema changes
pnpm run db:migrate               # Apply pending migrations
pnpm run db:push                  # Push schema directly (dev only)
pnpm run db:pull                  # Pull remote schema
pnpm run db:seed                  # Seed popular destination cities
pnpm run db:seed:photos           # Seed home photo data
pnpm run db:backfill:clerk-users  # Backfill existing Clerk users into clerk_users
pnpm run db:studio                # Open Drizzle Studio (visual DB browser)
```

## Environment Variables

In `packages/db/.env.local`:

```env
DATABASE_URL=your_neon_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```
