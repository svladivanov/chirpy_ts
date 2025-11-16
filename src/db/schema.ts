import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar('email', { length: 256 }).notNull().unique(),
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
