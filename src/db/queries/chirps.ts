import { eq } from 'drizzle-orm'
import { db } from '../index.js'
import { Chirp, chirps, NewChirp } from '../schema.js'

export async function createChirp(chirp: NewChirp): Promise<Chirp> {
  const [result] = await db.insert(chirps).values(chirp).returning()

  return result
}

export async function getChirps(): Promise<Chirp[]> {
  return await db.select().from(chirps).orderBy(chirps.createdAt)
}

export async function getChirpByID(chirpID: string): Promise<Chirp> {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpID))

  return result
}

export async function deleteChirpByID(chirpID: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, chirpID)).returning()

  return rows.length > 0
}
