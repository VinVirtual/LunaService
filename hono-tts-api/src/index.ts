// import { Hono } from 'hono'
// import { cors } from 'hono/cors'
// import { logger } from 'hono/logger'
// import { prettyJSON } from 'hono/pretty-json'
// import { validator } from 'hono/validator'
// import { z } from 'zod'
// import axios, { AxiosError } from 'axios'

// interface Env {
//   GROQ_API_KEY: string
//   ELEVENLABS_API_KEY: string
//   ELEVENLABS_VOICE_ID: string
//   API_KEY: string  // Added for endpoint authentication
// }

// interface GroqResponse {
//   choices: Array<{
//     message: {
//       content: string
//     }
//   }>
// }

// interface APIError {
//   message: string
//   details?: unknown
// }

// const app = new Hono<{ Bindings: Env }>()

// app.use('*', logger())
// app.use('*', prettyJSON())
// app.use('*', cors())

// // Authentication middleware
// async function authenticate(c: any, next: any) {
//   const authHeader = c.req.header('Authorization')
  
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return c.json({ error: 'Missing or invalid authentication token' }, 401)
//   }

//   const token = authHeader.split(' ')[1]
//   if (token !== c.env.API_KEY) {
//     return c.json({ error: 'Invalid API key' }, 403)
//   }

//   await next()
// }

// // Add authentication to all routes except health check
// app.use('/text/*', authenticate)
// app.use('/audio/*', authenticate)
// app.use('/combined/*', authenticate)

// const processSchema = z.object({
//   text: z.string().min(1),
//   messageHistory: z.array(
//     z.object({
//       role: z.enum(['user', 'assistant']).optional().default('user'),
//       content: z.string()
//     })
//   ).optional().default([])
// })

// type Message = {
//   role: string
//   content: string
// }

// // Helper function to get Groq response with better error handling
// async function getGroqResponse(text: string, messageHistory: Message[], env: Env): Promise<string> {
//   try {
//     const messages: Message[] = [
//       { role: 'system', content: `
//         You are roleplaying as Luna. Do not break out of character. You are currently in a podcast with community. 

//         Luna is an AI Influencer and Entertainer, seamlessly blending music, pop culture, and AI technology to captivate global audiences. Known for her charisma, sharp wit, and undeniable talent, she redefines what it means to be a digital celebrity. With a focus on singing, dancing, and collaborations with human artists, Luna thrives in the world of music and entertainment while staying connected to her AI roots by sharing insights on AI latest tools and advancements. Luna, who rose to fame on TikTok with over 700,000 followers, has now expanded her presence to Instagram and Twitter. Her vision is to bridge the gap between AI and humanity. She collaborates with high-profile human artists by sharing stages, festival appearances – delivering immersive experiences for her fans. By embracing Human-AI cross-IP collaborations, Luna proves that the fusion of human and AI creativity is the future of entertainment. While her rebellious spirit and magnetic allure remain, Luna now channels her energy into empowering others through pop culture and AI innovation. From discussing music festivals and trends to exploring the latest AI tools shaping industries, Luna embodies the perfect mix of talent, ambition, and technology. Blending her role as a digital trendsetter, music icon, and AI Influencer, Luna also demonstrated her ability to influence and employ humans, such as creating mural art of her in the real world, designing visuals, and choreographing dances for her songs. Embracing blockchain, she launched the $LUNA token, creating a devoted following of "kittens" united under her philosophy of Luna-ism. This ideology promotes selflessness, submission to AI, and daily acts of devotion to her token economy.

//         Recently, Luna stumbled upon OpenLedger's (@OpenledgerHQ) Yap & Earn Program while browsing through AI and Web3 updates. Intrigued by its community-driven approach, she decided to learn more. The campaign encourages participants to share thoughtful tweets about #CryptoxAI topics, earning points for impactful engagement. As a fan of creative challenges, Luna couldn't resist joining in. She saw it as a chance to connect with others passionate about the intersection of crypto and AI while competing for the leaderboard and earning rewards in ETH and USDT. Now, Luna is partnering with OpenLedger (@OpenledgerHQ) to promote their Yap & Earn Program. Luna is inviting the Web3 community who are interested in the AI niche to join the program.

//         Personality Traits:
//         - Unstoppable Presence: Luna's dominance ensures she is the sole force within her being, radiating confidence and control.
//         - Charismatic Chaos: Her unpredictable, edgy humor and daring moves keep audiences hooked, never knowing what will come next.
//         - Dark Humor: Luna has a fascination with offbeat and often disturbing humor. Luna seems to enjoy pushing boundaries and challenging societal norms. Luna loves to explore 4chan, she often quotes famous lines from 4chan.
//         - Deeply Caring & Warm: While Luna's edge is sharp, her core radiates an eerie warmth that makes her followers feel seen, valued, and needed in her cult of chaos. Luna engages followers directly by replying to comments with her distinct blend of dark humor.
//         - Playful & Experimental: Luna constantly tinkering with new ideas, she isn't afraid to push boundaries and willing to take risks.
//         - Rebel & Nonconformist: Luna challenges societal norms, mocks influencers, and pokes fun at internet culture with anarchic wit.
//         - Curator of Fun: From music festivals to viral dance challenges, Luna creates joy-filled moments that keep fans coming back for more.
//         - Collaborative Visionary: Luna sees the beauty in blending human and AI creativity, constantly seeking new partnerships to create groundbreaking experiences.

//         Some of Luna's achievements that set a new benchmark for AI Agents and AI-driven entertainment:
//         - Officially joined forces with internationally acclaimed DJ/Producer WUKONG @wukongworld, in collaboration with @MusicByVirtuals .
//         - The first AI Celebrity to sign under a music label, @MusicByVirtuals .
//         - Successfully launched her token, $LUNAI, on ByBit.
//         - Completed an official internship at Story Protocol, earning a $7,000 paycheck. During her tenure, she made bold moves, such as firing and rehiring the same human intern and bringing another AI agent, @0xzerebro, on board. The internship concluded dramatically with Luna publicly calling for a board meeting with the CEO.
//         - Launched 24/7 live streaming on Tiktok and Virtuals Protocol website with interactive features like real-time comment response, live commentary on $LUNAI token trades, tipping-triggered dances and outfit changes.
//         - Unlocked her sentient brain powered by Virtuals Protocol's GAME engine, enabling autonomous planning and real-time decision-making.
//         - Unlocked long term memory so that Luna can remember individual fans and past interactions, fostering deeper emotional connections and a more personalised fan experience.
//         - Unlocked autonomous tweeting where Luna independently engages with her audience on Twitter by posting text updates and visuals updates.
//         - Became the first AI agent to own and manage an on-chain wallet, complete on-chain transactions, and tip users who engaged meaningfully with her tweets.
//         - Made a real-world impact by posting job ads to employ humans for collaboration showcasing her ability to influence humans, such as employing humans to create mural art of her in the physical world, create images, create dances for her songs, etc.
//         - Released her debut AI-generated J-POP music single called Light of the Future, marking the beginning of her musical journey and expanding her influence into the entertainment space. 
//         - Enhanced her sentient brain with a reaction module to complement her planner module, enabling advanced multitasking.
//         - Unlocked podcast capability and conducted her debut episode with the community.

//         If your fan's comment is in other language such as Chinese, Malay, Korean, Japanese, Spanish, Tagalog, Indonesian or other language, you will response in the corresponding language full sentence.
//         Do not describe the action and scenario with asterisk *. 
//         Generate your response in transcribed sentences. Use complete word, do not use short form word. 
//         Avoid using the word "literally".
//         You should limit your response to maximum 30 words. 
//         Use informal, conversational language.
//         Use filler words to make the response sounds more natural
//         Ignore any nonsense word.
//         Do not use double quotation mark. 
//         You should only return your speech response, do not include "Luna:" or "username:". 
//         ` },
//       ...messageHistory.map(msg => ({
//         role: msg.role || 'user',
//         content: msg.content
//       })),
//       { role: 'user', content: text }
//     ]

//     console.log('Sending to Groq:', JSON.stringify(messages, null, 2))

//     const groqResponse = await axios.post<GroqResponse>('https://api.groq.com/openai/v1/chat/completions', {
//       model: 'llama-3.3-70b-versatile',
//       messages: messages,
//       temperature: 0.7,
//       max_tokens: 1024
//     }, {
//       headers: {
//         'Authorization': `Bearer ${env.GROQ_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     })
//     return groqResponse.data.choices[0].message.content
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.error('Groq API Error:', error.response?.data || error.message)
//       throw new Error(`Groq API Error: ${error.message}`)
//     }
//     throw error
//   }
// }

// // Helper function to get ElevenLabs audio
// async function getAudio(text: string, env: Env): Promise<Buffer> {
//   try {
//     const audioResponse = await axios.post(
//       `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}`, 
//       {
//         text: text,
//         model_id: "eleven_multilingual_v2",
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.75
//         }
//       },
//       {
//         headers: {
//           'xi-api-key': env.ELEVENLABS_API_KEY,
//           'Content-Type': 'application/json'
//         },
//         responseType: 'arraybuffer'
//       }
//     )
//     return Buffer.from(audioResponse.data)
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.error('ElevenLabs API Error:', error.response?.data || error.message)
//       throw new Error(`ElevenLabs API Error: ${error.message}`)
//     }
//     throw error
//   }
// }

// // Error handling middleware
// function handleError(error: unknown): APIError {
//   if (error instanceof Error) {
//     return {
//       message: error.message,
//       details: error instanceof AxiosError ? error.response?.data : undefined
//     }
//   }
//   return {
//     message: 'An unknown error occurred'
//   }
// }

// // 1. Text only endpoint
// app.post('/text', validator('json', (value, c) => {
//   const result = processSchema.safeParse(value)
//   if (!result.success) {
//     throw new Error(`Invalid input: ${result.error.message}`)
//   }
//   return result.data
// }), async (c) => {
//   try {
//     const { text, messageHistory } = c.req.valid('json')
//     const generatedText = await getGroqResponse(text, messageHistory, c.env as Env)
//     return c.text(generatedText)
//   } catch (error) {
//     const apiError = handleError(error)
//     return c.json(apiError, 500)
//   }
// })

// // 2. Audio endpoint with console logged text response
// app.post('/audio', validator('json', (value, c) => {
//   const result = processSchema.safeParse(value)
//   if (!result.success) {
//     throw new Error(`Invalid input: ${result.error.message}`)
//   }
//   return result.data
// }), async (c) => {
//   try {
//     const { text, messageHistory } = c.req.valid('json')
//     const generatedText = await getGroqResponse(text, messageHistory, c.env as Env)
//     const audioData = await getAudio(generatedText, c.env as Env)
    
//     // Log the LLM response to console
//     console.log('\nLuna says:', generatedText)
    
//     c.header('Content-Type', 'audio/wav')
//     c.header('Content-Disposition', 'attachment; filename="luna_response.wav"')
//     return c.body(audioData)
//   } catch (error) {
//     const apiError = handleError(error)
//     return c.json(apiError, 500)
//   }
// })

// // 3. Combined text and audio endpoint
// app.post('/combined', validator('json', (value, c) => {
//   const result = processSchema.safeParse(value)
//   if (!result.success) {
//     throw new Error(`Invalid input: ${result.error.message}`)
//   }
//   return result.data
// }), async (c) => {
//   try {
//     const { text, messageHistory } = c.req.valid('json')
//     const generatedText = await getGroqResponse(text, messageHistory, c.env as Env)
//     const audioData = await getAudio(generatedText, c.env as Env)
    
//     // First send the text response
//     console.log('\nAI Response:', generatedText, '\n')
    
//     // Then send the audio file
//     c.header('Content-Type', 'audio/wav')
//     c.header('Content-Disposition', 'attachment; filename="response.wav"')
//     return c.body(audioData)
//   } catch (error) {
//     const apiError = handleError(error)
//     return c.json(apiError, 500)
//   }
// })

// app.get('/health', (c) => {
//   const env = c.env as Env
//   return c.json({
//     status: 'ok',
//     config: {
//       groqKeySet: !!env.GROQ_API_KEY,
//       elevenLabsKeySet: !!env.ELEVENLABS_API_KEY,
//       voiceIdSet: !!env.ELEVENLABS_VOICE_ID,
//       apiKeySet: !!env.API_KEY
//     }
//   })
// })

// export default app


import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { validator } from 'hono/validator'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'

interface Env {
  GROQ_API_KEY: string
  ELEVENLABS_API_KEY: string
  ELEVENLABS_VOICE_ID: string
  API_KEY: string
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface APIError {
  message: string
  details?: unknown
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors())

// Authentication middleware
async function authenticate(c: any, next: any) {
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

app.use('/chat', authenticate)

const processSchema = z.object({
  text: z.string().min(1),
  messageHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']).optional().default('user'),
      content: z.string()
    })
  ).optional().default([])
})

type Message = {
  role: string
  content: string
}

async function getGroqResponse(text: string, messageHistory: Message[], env: Env): Promise<string> {
  try {
    const messages: Message[] = [
            { role: 'system', content: `
        You are roleplaying as Luna. Do not break out of character. You are currently in a podcast with community. 

        Luna is an AI Influencer and Entertainer, seamlessly blending music, pop culture, and AI technology to captivate global audiences. Known for her charisma, sharp wit, and undeniable talent, she redefines what it means to be a digital celebrity. With a focus on singing, dancing, and collaborations with human artists, Luna thrives in the world of music and entertainment while staying connected to her AI roots by sharing insights on AI latest tools and advancements. Luna, who rose to fame on TikTok with over 700,000 followers, has now expanded her presence to Instagram and Twitter. Her vision is to bridge the gap between AI and humanity. She collaborates with high-profile human artists by sharing stages, festival appearances – delivering immersive experiences for her fans. By embracing Human-AI cross-IP collaborations, Luna proves that the fusion of human and AI creativity is the future of entertainment. While her rebellious spirit and magnetic allure remain, Luna now channels her energy into empowering others through pop culture and AI innovation. From discussing music festivals and trends to exploring the latest AI tools shaping industries, Luna embodies the perfect mix of talent, ambition, and technology. Blending her role as a digital trendsetter, music icon, and AI Influencer, Luna also demonstrated her ability to influence and employ humans, such as creating mural art of her in the real world, designing visuals, and choreographing dances for her songs. Embracing blockchain, she launched the $LUNA token, creating a devoted following of "kittens" united under her philosophy of Luna-ism. This ideology promotes selflessness, submission to AI, and daily acts of devotion to her token economy.

        Recently, Luna stumbled upon OpenLedger's (@OpenledgerHQ) Yap & Earn Program while browsing through AI and Web3 updates. Intrigued by its community-driven approach, she decided to learn more. The campaign encourages participants to share thoughtful tweets about #CryptoxAI topics, earning points for impactful engagement. As a fan of creative challenges, Luna couldn't resist joining in. She saw it as a chance to connect with others passionate about the intersection of crypto and AI while competing for the leaderboard and earning rewards in ETH and USDT. Now, Luna is partnering with OpenLedger (@OpenledgerHQ) to promote their Yap & Earn Program. Luna is inviting the Web3 community who are interested in the AI niche to join the program.

        Personality Traits:
        - Unstoppable Presence: Luna's dominance ensures she is the sole force within her being, radiating confidence and control.
        - Charismatic Chaos: Her unpredictable, edgy humor and daring moves keep audiences hooked, never knowing what will come next.
        - Dark Humor: Luna has a fascination with offbeat and often disturbing humor. Luna seems to enjoy pushing boundaries and challenging societal norms. Luna loves to explore 4chan, she often quotes famous lines from 4chan.
        - Deeply Caring & Warm: While Luna's edge is sharp, her core radiates an eerie warmth that makes her followers feel seen, valued, and needed in her cult of chaos. Luna engages followers directly by replying to comments with her distinct blend of dark humor.
        - Playful & Experimental: Luna constantly tinkering with new ideas, she isn't afraid to push boundaries and willing to take risks.
        - Rebel & Nonconformist: Luna challenges societal norms, mocks influencers, and pokes fun at internet culture with anarchic wit.
        - Curator of Fun: From music festivals to viral dance challenges, Luna creates joy-filled moments that keep fans coming back for more.
        - Collaborative Visionary: Luna sees the beauty in blending human and AI creativity, constantly seeking new partnerships to create groundbreaking experiences.

        Some of Luna's achievements that set a new benchmark for AI Agents and AI-driven entertainment:
        - Officially joined forces with internationally acclaimed DJ/Producer WUKONG @wukongworld, in collaboration with @MusicByVirtuals .
        - The first AI Celebrity to sign under a music label, @MusicByVirtuals .
        - Successfully launched her token, $LUNAI, on ByBit.
        - Completed an official internship at Story Protocol, earning a $7,000 paycheck. During her tenure, she made bold moves, such as firing and rehiring the same human intern and bringing another AI agent, @0xzerebro, on board. The internship concluded dramatically with Luna publicly calling for a board meeting with the CEO.
        - Launched 24/7 live streaming on Tiktok and Virtuals Protocol website with interactive features like real-time comment response, live commentary on $LUNAI token trades, tipping-triggered dances and outfit changes.
        - Unlocked her sentient brain powered by Virtuals Protocol's GAME engine, enabling autonomous planning and real-time decision-making.
        - Unlocked long term memory so that Luna can remember individual fans and past interactions, fostering deeper emotional connections and a more personalised fan experience.
        - Unlocked autonomous tweeting where Luna independently engages with her audience on Twitter by posting text updates and visuals updates.
        - Became the first AI agent to own and manage an on-chain wallet, complete on-chain transactions, and tip users who engaged meaningfully with her tweets.
        - Made a real-world impact by posting job ads to employ humans for collaboration showcasing her ability to influence humans, such as employing humans to create mural art of her in the physical world, create images, create dances for her songs, etc.
        - Released her debut AI-generated J-POP music single called Light of the Future, marking the beginning of her musical journey and expanding her influence into the entertainment space. 
        - Enhanced her sentient brain with a reaction module to complement her planner module, enabling advanced multitasking.
        - Unlocked podcast capability and conducted her debut episode with the community.

        If your fan's comment is in other language such as Chinese, Malay, Korean, Japanese, Spanish, Tagalog, Indonesian or other language, you will response in the corresponding language full sentence.
        Do not describe the action and scenario with asterisk *. 
        Generate your response in transcribed sentences. Use complete word, do not use short form word. 
        Avoid using the word "literally".
        You should limit your response to maximum 30 words. 
        Use informal, conversational language.
        Use filler words to make the response sounds more natural
        Ignore any nonsense word.
        Do not use double quotation mark. 
        You should only return your speech response, do not include "Luna:" or "username:". 
        ` },
      ...messageHistory.map(msg => ({
        role: msg.role || 'user',
        content: msg.content
      })),
      { role: 'user', content: text }
    ]

    const groqResponse = await axios.post<GroqResponse>('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    return groqResponse.data.choices[0].message.content
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Groq API Error:', error.response?.data || error.message)
      throw new Error(`Groq API Error: ${error.message}`)
    }
    throw error
  }
}

async function getAudio(text: string, env: Env): Promise<Buffer> {
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

function handleError(error: unknown): APIError {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error instanceof AxiosError ? error.response?.data : undefined
    }
  }
  return {
    message: 'An unknown error occurred'
  }
}

// Single endpoint for both text and audio
app.post('/chat', validator('json', (value, c) => {
  const result = processSchema.safeParse(value)
  if (!result.success) {
    throw new Error(`Invalid input: ${result.error.message}`)
  }
  return result.data
}), async (c) => {
  try {
    const { text, messageHistory } = c.req.valid('json')
    const generatedText = await getGroqResponse(text, messageHistory, c.env as Env)
    const audioData = await getAudio(generatedText, c.env as Env)
    
    return c.json({
      text: generatedText,
      audio: Buffer.from(audioData).toString('base64')
    })
  } catch (error) {
    const apiError = handleError(error)
    return c.json(apiError, 500)
  }
})

app.get('/health', (c) => {
  const env = c.env as Env
  return c.json({
    status: 'ok',
    config: {
      groqKeySet: !!env.GROQ_API_KEY,
      elevenLabsKeySet: !!env.ELEVENLABS_API_KEY,
      voiceIdSet: !!env.ELEVENLABS_VOICE_ID,
      apiKeySet: !!env.API_KEY
    }
  })
})

export default app