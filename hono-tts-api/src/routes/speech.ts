import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { z } from 'zod'
import { TextService } from '../services/text.service'
import { SpeechService } from '../services/speech.service'
import { Env } from '../types'

const speechRouter = new Hono<{ Bindings: Env }>()

const processSchema = z.object({
  text: z.string().min(1),
  messageHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']).optional().default('user'),
      content: z.string()
    })
  ).optional().default([])
})

speechRouter.post('/chat', validator('json', (value, c) => {
  const result = processSchema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid input: ${result.error.message}`)
  }
  return result.data
}), async (c) => {
  try {
    const { text, messageHistory } = c.req.valid('json')
    const generatedText = await TextService.generateResponse(text, messageHistory, c.env)
    const audioData = await SpeechService.generateSpeech(generatedText, c.env)
    
    return c.json({
      text: generatedText,
      audio: Buffer.from(audioData).toString('base64')
    })
  } catch (error) {
    return c.json({ error: 'Speech generation failed' }, 500)
  }
})

export default speechRouter