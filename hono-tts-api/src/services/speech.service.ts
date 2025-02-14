import axios, { AxiosError } from 'axios'
import { Env } from '../types'

export class SpeechService {
  static async generateSpeech(text: string, env: Env): Promise<Buffer> {
    try {
      const audioResponse = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}`,
        {
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'xi-api-key': env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      )
      return Buffer.from(audioResponse.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('ElevenLabs API Error:', error.response?.data || error.message)
        throw new Error(`ElevenLabs API Error: ${error.message}`)
      }
      throw error
    }
  }
}