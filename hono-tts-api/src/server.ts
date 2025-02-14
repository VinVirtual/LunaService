import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { resolve } from 'path'
import app from './index'

// Load environment variables with explicit path
const envPath = resolve(process.cwd(), '.env')
config({ path: envPath })

// Log environment status (remove this in production)
console.log('Environment variables status:', {
  groqKeySet: !!process.env.GROQ_API_KEY,
  elevenLabsKeySet: !!process.env.ELEVENLABS_API_KEY,
  voiceIdSet: !!process.env.ELEVENLABS_VOICE_ID,
  apiKeySet: !!process.env.API_KEY,
  envPath
})

// Verify required environment variables
const requiredEnvVars = ['GROQ_API_KEY', 'ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID' , 'API_KEY']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars)
  console.error('Please create a .env file in:', envPath)
  process.exit(1)
}

const port = process.env.PORT || 3000

// Serve the application
serve({
  fetch: (request: Request) => {
    return app.fetch(request, {
      // Pass environment variables as bindings
      GROQ_API_KEY: process.env.GROQ_API_KEY!,
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY!,
      ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID!,
      API_KEY: process.env.API_KEY!
    })
  },
  port: Number(port)
})

console.log(`Server is running on port ${port}`)