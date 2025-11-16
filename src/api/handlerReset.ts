import type { Request, Response } from 'express'
import { config } from '../config.js'
import { deleteUsers } from '../db/queries/users.js'
import { UserForbiddenError } from './errors.js'

export async function handlerReset(_: Request, res: Response) {
  if (config.api.plaform !== 'dev') {
    console.log(config.api.plaform)
    throw new UserForbiddenError('Reset only allowed in dev environment')
  }

  config.api.fileserverHits = 0
  await deleteUsers()
  res.write('Hits reset to 0\n')
  res.end()
}
