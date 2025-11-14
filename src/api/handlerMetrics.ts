import type { Request, Response } from 'express'
import { config } from '../config.js'

export function handlerMetrics(_: Request, res: Response) {
  res.send(`Hits: ${config.fileserverHits}`)
}
