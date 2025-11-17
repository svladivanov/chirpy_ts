import type { Request, Response } from 'express'
import { getUserByEmail } from '../db/queries/users.js'
import { UserNotAuthenticatedError } from './errors.js'
import { respondWithJSON } from './json.js'
import { checkPasswordHash, makeJWT } from '../auth.js'
import { config } from '../config.js'
import { UserResponse } from './handlerUsers.js'

type LoginResponse = UserResponse & { token: string }

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string
    email: string
    expiresIn?: number
  }

  const params: parameters = req.body

  const user = await getUserByEmail(params.email)
  if (!user) {
    throw new UserNotAuthenticatedError('invalid username or password')
  }

  const matching = await checkPasswordHash(params.password, user.hashedPassword)
  if (!matching) {
    throw new UserNotAuthenticatedError('invalid username or password')
  }

  let duration = config.jwt.defaultDuration
  if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    duration = params.expiresIn
  }
  const newToken = makeJWT(user.id, duration, config.jwt.secret)

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: newToken,
  } satisfies LoginResponse)
}
