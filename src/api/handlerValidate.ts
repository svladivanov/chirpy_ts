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

  const words = params.body.split(' ')
  const badWords = ['kerfuffle', 'sharbert', 'fornax']
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const loweredWord = word.toLowerCase()
    if (badWords.includes(loweredWord)) {
      words[i] = '****'
    }
  }
  const result = words.join(' ')
  respondWithJSON(res, 200, { cleanedBody: result })
}
