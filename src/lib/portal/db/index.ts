import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Single pool per serverless instance; DATABASE_URL is server-only.
const globalForDb = globalThis as unknown as { pgPool?: Pool };

const pool =
  globalForDb.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });

if (process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool;

export const db = drizzle(pool, { schema });
export * as tables from './schema';
