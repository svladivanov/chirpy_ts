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
