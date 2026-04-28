import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema';

const currentFilePath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(currentFilePath), '..');

dotenv.config({ path: path.join(packageRoot, '.env.local') });
dotenv.config({ path: path.join(packageRoot, '.env') });

const createDb = (databaseUrl: string) => {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
};

type Database = ReturnType<typeof createDb>;

let database: Database | undefined;

export function getDb(): Database {
  if (database) {
    return database;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set.');
  }

  database = createDb(databaseUrl);
  return database;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, property, _receiver) {
    const client = getDb();
    const value = Reflect.get(client, property, client);

    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export { schema };
