import 'dotenv/config';
import { seed } from 'drizzle-seed';
import { db, schema } from './index';

async function main() {
  if (Object.keys(schema).length === 0) {
    console.info(
      'No schema exports found in src/db/schema.ts. Add tables before running the seed.',
    );
    return;
  }

  await seed(db, schema);
  console.info('Database seed completed.');
}

main().catch((error) => {
  console.error('Database seed failed.');
  console.error(error);
  process.exit(1);
});
