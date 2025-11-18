import { Request, Response } from 'express'
import { createUser, updateUser, upgradeUser } from '../db/queries/users.js'
import { NewUser, User } from '../db/schema.js'
import { respondWithJSON } from './json.js'
import { BadRequestError, NotFoundError } from './errors.js'
import { getBearerToken, hashPassword, validateJWT } from '../auth.js'
import { config } from '../config.js'

export type UserResponse = Omit<NewUser, 'hashedPassword'>

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string
    password: string
  }
  const params: parameters = req.body
  if (!params.email || !params.password) {
    throw new BadRequestError('Missing required fields')
  }

  const hashedPassword = await hashPassword(params.password)

  const user: User = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser)
  if (!user) {
    throw new Error('Could not create user')
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse)
}

export async function handlerUpdateUser(req: Request, res: Response) {
  type parameters = {
    email: string
    password: string
  }
  const params: parameters = req.body
  if (!params.email || !params.password) {
    throw new BadRequestError('Missing required fields')
  }

  const reqToken = getBearerToken(req)
  const userID = validateJWT(reqToken, config.jwt.secret)

  const hashedPassword = await hashPassword(params.password)
  const updatedUser = await updateUser(userID, {
    email: params.email,
    hashedPassword: hashedPassword,
  })

  respondWithJSON(res, 200, {
    id: updatedUser.id,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    isChirpyRed: updatedUser.isChirpyRed,
  } satisfies UserResponse)
}

export async function handlerUpgradeUser(req: Request, res: Response) {
  type parameters = {
    event: string
    data: {
      userId: string
    }
  }
  const params: parameters = req.body
  if (params.event !== 'user.upgraded') {
    res.status(204).send()
    return
  }

  const upgraded = await upgradeUser(params.data.userId)
  if (!upgraded) {
    throw new NotFoundError('User could not be found')
  }

  res.status(204).send()
}
