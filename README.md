# Familiar — Home Swapping, Reimagined

A home-swapping platform where members swap homes with trusted connections worldwide, skip hotel prices, and stay like locals.

## Tech Stack

- **Nx** — monorepo tooling
- **Next.js 16** (`@org/web`) — web app with App Router
- **Playwright** (`@org/web-e2e`) — e2e tests
- **Tailwind v4** — CSS-first styling
- **shadcn/ui** — component library
- **Prettier**, **ESLint** — formatting and linting
- **Commitlint + Husky** — [Conventional Commits](https://www.conventionalcommits.org/)

## Commands

```sh
npm exec nx run @org/web:dev      # Start Next.js app
npm exec nx run @org/web:build    # Build web app
npm run test                        # Run all tests
npm run lint         # Lint all projects
npm run format       # Format with Prettier
npm exec nx run @org/web-e2e:e2e   # Run e2e tests
```

## Database (Drizzle + Neon)

The web app uses Drizzle ORM with Neon PostgreSQL.

Location:

- `apps/web/src/db/schema.ts` - table definitions (`cities`, `clerk_users`)
- `apps/web/src/db/queries` - DB queries
- `apps/web/src/db/seed.ts` - seed data for DB

Run DB commands from `apps/web`:

```sh
cd apps/web
npm run db:generate  # Generate migration files from schema
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed popular destination cities
npm run db:studio    # Open Drizzle Studio
```

Required environment variables in `apps/web/.env`:

```env
DATABASE_URL=your_neon_connection_string
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret
```

## Clerk Webhook Sync

Clerk user lifecycle events are synced to the database at:

- `apps/web/src/app/api/webhooks/clerk/route.ts`

Supported events:

- `user.created` - upsert into `clerk_users`
- `user.updated` - update `clerk_users.updated_at`
- `user.deleted` - delete from `clerk_users`

Configure this endpoint in Clerk Webhooks and use the same signing secret in all runtime environments.

## Frontend

The homepage (`apps/web/src/app/page.tsx`) renders three sections:

- **Hero** — headline and CTA
- **Popular Destinations** — DB-backed city cards loaded via React Suspense with an animated skeleton fallback, and using a delay for demo purposes
- **How It Works** — feature overview

### Popular Destinations

- The section streams in using React Suspense — `PopularDestinationsSkeleton` shows while data loads

## Project Structure

- `apps/web` — Next.js marketing site and dashboard
- `apps/web-e2e` — Playwright e2e tests

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Set up CI (non-Github Actions CI)

**Note:** This is only required if your CI provider is not GitHub Actions.

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
