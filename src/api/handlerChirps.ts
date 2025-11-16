import { Request, Response } from 'express'
import { respondWithJSON } from './json.js'
import { BadRequestError } from './errors.js'
import { createChirp, getChirpByID, getChirps } from '../db/queries/chirps.js'
import { NewChirp } from '../db/schema.js'

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string
    userId: string
  }

  const params: parameters = req.body

  const cleaned = validateChirp(params.body)
  const newChirp: NewChirp = {
    body: cleaned,
    userId: params.userId,
  }
  const chirp = await createChirp(newChirp)

  respondWithJSON(res, 201, chirp)
}

export async function handlerGetChirps(_: Request, res: Response) {
  const chirps = await getChirps()

  respondWithJSON(res, 200, chirps)
}

export async function handlerGetChirpByID(req: Request, res: Response) {
  const chirpID = req.params.chirpID
  if (!chirpID) {
    throw new BadRequestError('Must provide a chirp ID')
  }

  const chirp = await getChirpByID(chirpID)

  respondWithJSON(res, 200, chirp)
}

function validateChirp(body: string) {
  const maxChirpLength = 140
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    )
  }

  const badWords = ['kerfuffle', 'sharbert', 'fornax']
  return getCleanedBody(body, badWords)
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(' ')

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const loweredWord = word.toLowerCase()
    if (badWords.includes(loweredWord)) {
      words[i] = '****'
    }
  }
  const cleaned = words.join(' ')
  return cleaned
}
