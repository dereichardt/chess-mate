const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1'

interface ElevenLabsOptions {
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

export class ElevenLabsError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ElevenLabsError'
    this.status = status
  }
}

export async function synthesizeLessonSpeech(
  text: string,
  options: ElevenLabsOptions = {},
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = options.voiceId || process.env.ELEVENLABS_VOICE_ID
  const modelId = options.modelId || process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
  const stability = options.stability ?? 0.5
  const similarityBoost = options.similarityBoost ?? 0.75

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured')
  }

  if (!voiceId) {
    throw new Error('ELEVENLABS_VOICE_ID is not configured')
  }

  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }),
  })

  if (!response.ok) {
    let message = `ElevenLabs TTS request failed with status ${response.status}`
    try {
      const errorText = await response.text()
      if (errorText) {
        message += `: ${errorText}`
      }
    } catch {
      // ignore body parse errors
    }
    throw new ElevenLabsError(message, response.status)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

