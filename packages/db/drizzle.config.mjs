import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const packageRoot = path.dirname(currentFilePath);

dotenv.config({ path: path.join(packageRoot, '.env.local') });
dotenv.config({ path: path.join(packageRoot, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to packages/db/.env.local or packages/db/.env.');
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
});
