import { Request, Response } from 'express'
import { respondWithError, respondWithJSON } from './json.js'

export function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string
  }
  const params: parameters = req.body

  if (params.body.length > 140) {
    respondWithError(res, 400, 'Chirp is too long')
    return
  }

  respondWithJSON(res, 200, { valid: true })
}
