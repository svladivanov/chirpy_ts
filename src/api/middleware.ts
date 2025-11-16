import type { Request, Response, NextFunction } from 'express'
import { config } from '../config.js'
import { respondWithError } from './json.js'
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
  UserNotAuthenticatedError,
} from './errors.js'

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
  let errorMessage = 'Something went wrong on our end'

  switch (true) {
    case err instanceof BadRequestError:
      statusCode = 400
      errorMessage = err.message
    case err instanceof UserNotAuthenticatedError:
      statusCode = 401
      errorMessage = err.message
    case err instanceof UserForbiddenError:
      statusCode = 403
      errorMessage = err.message
    case err instanceof NotFoundError:
      statusCode = 404
      errorMessage = err.message
  }

  if (statusCode >= 500) {
    console.log(err.message)
  }

  respondWithError(res, statusCode, errorMessage)
}
