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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set.');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
