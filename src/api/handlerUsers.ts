import { Request, Response } from 'express'
import { createUser, updateUser } from '../db/queries/users.js'
import { NewUser, User } from '../db/schema.js'
import { respondWithJSON } from './json.js'
import { BadRequestError, UserNotAuthenticatedError } from './errors.js'
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
  } satisfies UserResponse)
}
