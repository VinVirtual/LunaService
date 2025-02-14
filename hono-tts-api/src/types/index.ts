export interface Env {
    GROQ_API_KEY: string
    ELEVENLABS_API_KEY: string
    ELEVENLABS_VOICE_ID: string
    API_KEY: string
  }
  
  export interface GroqResponse {
    choices: Array<{
      message: {
        content: string
      }
    }>
  }
  
  export type Message = {
    role: string
    content: string
  }
  
  export interface APIError {
    message: string
    details?: unknown
  }