import { eq } from 'drizzle-orm'
import { db } from '../index.js'
import { NewUser, User, users } from '../schema.js'

export async function createUser(user: NewUser): Promise<User> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning()

  return result
}

export async function deleteUsers() {
  await db.delete(users)
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email))

  return result
}

export async function updateUser(userID: string, user: NewUser) {
  const [result] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, userID))
    .returning()

  return result
}

export async function upgradeUser(userID: string) {
  const [result] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userID))
    .returning()

  return result
}
