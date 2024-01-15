import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { oauth_users, users } from './schema';

const client = new Client({
  connectionString: (process.env.DATABASE_URL as string) || 'db:5432',
});
client.connect();
console.log('creating new connection to database...');

export const db = drizzle(client, { schema: { users, oauth_users } });
