import { Request, Response } from 'express'
import { respondWithJSON } from './json.js'
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
  UserNotAuthenticatedError,
} from './errors.js'
import {
  createChirp,
  deleteChirpByID,
  getChirpByID,
  getChirps,
} from '../db/queries/chirps.js'
import { NewChirp } from '../db/schema.js'
import { getBearerToken, validateJWT } from '../auth.js'
import { config } from '../config.js'

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string
  }

  const params: parameters = req.body

  const jwtToken = getBearerToken(req)
  const userID = validateJWT(jwtToken, config.jwt.secret)

  const cleaned = validateChirp(params.body)
  const newChirp: NewChirp = {
    body: cleaned,
    userId: userID,
  }
  const chirp = await createChirp(newChirp)

  respondWithJSON(res, 201, chirp)
}

export async function handlerGetChirps(req: Request, res: Response) {
  let authorId = ''
  let authorIdQuery = req.query.authorId
  if (typeof authorIdQuery === 'string') {
    authorId = authorIdQuery
  }

  let sort = 'asc'
  let sortQuery = req.query.sort
  if (sortQuery === 'desc') {
    sort = 'desc'
  }

  const chirps = await getChirps()
  const filteredChirps = chirps.filter(
    (chirp) => chirp.userId === authorId || authorId === ''
  )
  filteredChirps.sort((a, b) =>
    sort === 'asc'
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime()
  )

  respondWithJSON(res, 200, filteredChirps)
}

export async function handlerGetChirpByID(req: Request, res: Response) {
  const chirpID = req.params.chirpID
  if (!chirpID) {
    throw new BadRequestError('Must provide a chirp ID')
  }

  const chirp = await getChirpByID(chirpID)
  if (!chirp) {
    throw new NotFoundError('Chirp not found')
  }

  respondWithJSON(res, 200, chirp)
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const { chirpID } = req.params

  const token = getBearerToken(req)
  const userID = validateJWT(token, config.jwt.secret)

  const dbChrip = await getChirpByID(chirpID)
  if (!dbChrip) {
    throw new NotFoundError('Could not find chirp')
  }

  if (userID !== dbChrip.userId) {
    throw new UserForbiddenError("Cannot delete other users' chirps")
  }

  const deleted = await deleteChirpByID(chirpID)
  if (!deleted) {
    throw new Error('Failed to delete chirp')
  }

  res.status(204).send()
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
