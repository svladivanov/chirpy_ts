import type { Request, Response, NextFunction } from 'express'

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
