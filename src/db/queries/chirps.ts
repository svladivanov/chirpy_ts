import { db } from '../index.js'
import { Chirp, chirps, NewChirp } from '../schema.js'

export async function createChirp(chirp: NewChirp): Promise<Chirp> {
  const [result] = await db.insert(chirps).values(chirp).returning()

  return result
}
