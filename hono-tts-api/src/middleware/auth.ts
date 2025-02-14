import { Context, Next } from 'hono'
import { Env } from '../types'

export async function authenticate(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authentication token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (token !== c.env.API_KEY) {
    return c.json({ error: 'Invalid API key' }, 403)
  }

  await next()
}