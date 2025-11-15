import express from 'express'
import { handlerReadiness } from './api/handlerReadiness.js'
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from './api/middleware.js'
import { handlerReset } from './api/handlerReset.js'
import { handlerMetrics } from './api/handlerMetrics.js'
import { handlerChirpsValidate } from './api/handlerValidate.js'

const app = express()
const PORT = 8080

app.use(middlewareLogResponses)
app.use(express.json())
app.use('/app', middlewareMetricsInc, express.static('./src/app'))

app.get('/api/healthz', handlerReadiness)

app.post('/api/validate_chirp', handlerChirpsValidate)

app.get('/admin/metrics', handlerMetrics)
app.post('/admin/reset', handlerReset)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
