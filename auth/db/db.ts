import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { confirms, oauth_users, users } from './schema';
import { Logger } from '../shared/logger';

const client = new Client({
  connectionString: (process.env.DATABASE_URL as string) || 'db:5432',
});
try {
  client.connect();
  Logger.info('create new connection to database...');
} catch (error) {
  Logger.error(error);
}

export const db = drizzle(client, {
  schema: { users, oauth_users, confirms },
  logger: false,
});
