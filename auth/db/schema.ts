import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { string } from 'zod';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: varchar('email'),
    phone: varchar('phone'),
    password: varchar('password').notNull(),
  },
  (users) => ({
    emailIndex: uniqueIndex('email_idx').on(users.email),
    phoneIndex: uniqueIndex('phone_idx').on(users.phone),
  }),
);

export const oauth_users = pgTable('oauth_users', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  provider: varchar('provider').notNull(),
  external_id: integer('external_id'),
});

export const confirms = pgTable('confirms', {
  id: serial('id').primaryKey(),
  type: varchar('type').notNull(),
  address: varchar('address').notNull(),
  confirm_code: integer('confirm_code'),
  requested_at: timestamp('requested_at'),
  confirmed_at: timestamp('confirmed_at'),
});
