import express from 'express'
import { handlerReadiness } from './api/handlerReadiness.js'
import {
  middlerwareError,
  middlewareLogResponses,
  middlewareMetricsInc,
} from './api/middleware.js'
import { handlerReset } from './api/handlerReset.js'
import { handlerMetrics } from './api/handlerMetrics.js'
import {
  handlerCreateChirp,
  handlerDeleteChirp,
  handlerGetChirpByID,
  handlerGetChirps,
} from './api/handlerChirps.js'
import postgres from 'postgres'
import { config } from './config.js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import { handlerCreateUser, handlerUpdateUser } from './api/handlerUsers.js'
import { handlerLogin, handlerRefresh, handlerRevoke } from './api/auth.js'

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express()

app.use(middlewareLogResponses)
app.use(express.json())
app.use('/app', middlewareMetricsInc, express.static('./src/app'))

app.get('/api/healthz', (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next)
})

app.get('/admin/metrics', (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next)
})
app.post('/admin/reset', (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next)
})

app.post('/api/login', (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next)
})
app.post('/api/refresh', (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next)
})
app.post('/api/revoke', (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next)
})

app.get('/api/chirps', (req, res, next) => {
  Promise.resolve(handlerGetChirps(req, res)).catch(next)
})
app.get('/api/chirps/:chirpID', (req, res, next) => {
  Promise.resolve(handlerGetChirpByID(req, res)).catch(next)
})
app.delete('/api/chirps/:chirpID', (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res)).catch(next)
})
app.post('/api/chirps', (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next)
})

app.post('/api/users', (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next)
})
app.put('/api/users', (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next)
})

app.use(middlerwareError)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`)
})
