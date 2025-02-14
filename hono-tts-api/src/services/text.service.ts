import axios, { AxiosError } from 'axios'
import { Message, Env, GroqResponse } from '../types'
import { LUNA_PROMPT } from '../config/prompt'

export class TextService {
  static async generateResponse(text: string, messageHistory: Message[], env: Env): Promise<string> {
    try {
      const messages: Message[] = [
        { role: 'system', content: LUNA_PROMPT },
        ...messageHistory.map(msg => ({
          role: msg.role || 'user',
          content: msg.content
        })),
        { role: 'user', content: text }
      ]

      const groqResponse = await axios.post<GroqResponse>(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return groqResponse.data.choices[0].message.content
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Groq API Error:', error.response?.data || error.message)
        throw new Error(`Groq API Error: ${error.message}`)
      }
      throw error
    }
  }
}