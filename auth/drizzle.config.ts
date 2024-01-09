import { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL)
  throw new Error(
    'DATABASE_URL environment variable is not set, try run into docker exec shell',
  );

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: (process.env.DATABASE_URL as string) || 'db:5432',
  },
  strict: false, // false - no questions in actions
} satisfies Config;
