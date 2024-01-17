import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { confirms, oauth_users, users } from './schema';

const client = new Client({
  connectionString: (process.env.DATABASE_URL as string) || 'db:5432',
});
try {
  client.connect();
  console.log('create new connection to database...');
} catch (error) {
  console.error(error);
}

export const db = drizzle(client, { schema: { users, oauth_users, confirms } });
