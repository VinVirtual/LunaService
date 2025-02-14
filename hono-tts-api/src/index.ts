// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { authenticate } from './middleware/auth'
import textRouter from './routes/text'
import speechRouter from './routes/speech'
import { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors())

app.use('/api/*', authenticate)

app.route('/api/v1/text', textRouter)
app.route('/api/v1/speech', speechRouter)

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    config: {
      groqKeySet: !!c.env.GROQ_API_KEY,
      elevenLabsKeySet: !!c.env.ELEVENLABS_API_KEY,
      voiceIdSet: !!c.env.ELEVENLABS_VOICE_ID,
      apiKeySet: !!c.env.API_KEY
    }
  })
})

export default app