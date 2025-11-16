import type { Request, Response, NextFunction } from 'express'
import { config } from '../config.js'
import { respondWithError } from './json.js'

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode
  res.on('finish', () => {
    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`)
    }
  })

  next()
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction
) {
  config.fileserverHits++
  next()
}

export function middlerwareError(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  let statusCode = 500
  let message = 'Something went wrong on our end'

  console.log(err.message)

  respondWithError(res, statusCode, message)
}
