import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { z } from 'zod'
import { TextService } from '../services/text.service'
import { Env } from '../types'

const textRouter = new Hono<{ Bindings: Env }>()

const processSchema = z.object({
  text: z.string().min(1),
  messageHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']).optional().default('user'),
      content: z.string()
    })
  ).optional().default([])
})

textRouter.post('/chat', validator('json', (value, c) => {
  const result = processSchema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid input: ${result.error.message}`)
  }
  return result.data
}), async (c) => {
  try {
    const { text, messageHistory } = c.req.valid('json')
    const generatedText = await TextService.generateResponse(text, messageHistory, c.env)
    return c.json({ text: generatedText })
  } catch (error) {
    return c.json({ error: 'Text generation failed' }, 500)
  }
})

export default textRouter