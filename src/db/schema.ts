import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar('email', { length: 256 }).notNull().unique(),
  hashedPassword: varchar('hashed_password', { length: 256 })
    .notNull()
    .default('unset'),
  isChirpyRed: boolean('is_chirpy_red').default(false),
})

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect

export const chirps = pgTable('chirps', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar('body', { length: 256 }).notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
})

export type NewChirp = typeof chirps.$inferInsert
export type Chirp = typeof chirps.$inferSelect

export const refreshTokens = pgTable('refresh_tokens', {
  token: varchar('token', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
})

export type NewRefreshToken = typeof refreshTokens.$inferInsert
export type RefreshToken = typeof refreshTokens.$inferSelect
