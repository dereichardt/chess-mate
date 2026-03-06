import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'

interface LessonNarrationProps {
  audioUrl: string | null | undefined
  isPreloading: boolean
}

type NarrationState = 'idle' | 'playing' | 'paused' | 'error'

export default function LessonNarration({ audioUrl, isPreloading }: LessonNarrationProps) {
  const [state, setState] = useState<NarrationState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Reset when the lesson or step changes
    setState('idle')
    setErrorMessage(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [audioUrl])

  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    },
    [],
  )

  const handleToggle = async () => {
    try {
      if (!audioUrl) {
        setErrorMessage('Narration is unavailable right now.')
        setState('error')
        return
      }

      if (!audioRef.current) {
        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.addEventListener('ended', () => {
          setState('idle')
        })

        audio.addEventListener('pause', () => {
          if (!audio.ended) {
            setState((prev) => (prev === 'playing' ? 'paused' : prev))
          }
        })

        audio.addEventListener('play', () => {
          setState('playing')
        })
      }

      const audio = audioRef.current
      if (!audio) return

      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch {
      // error state is already handled in ensureAudio
    }
  }

  const isPlaying = state === 'playing'
  const isLoading = isPreloading && !audioUrl

  let label = 'Play narration'
  if (isLoading) {
    label = 'Loading narration…'
  } else if (isPlaying) {
    label = 'Pause narration'
  }

  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">
          Lesson narration
        </span>
        <Button
          type="button"
          variant="secondary"
          onClick={handleToggle}
          disabled={isLoading || state === 'error'}
          className="text-xs px-3 py-1.5"
        >
          <span className="flex items-center gap-1.5">
            {isLoading ? (
              <svg
                className="w-3.5 h-3.5 animate-spin text-primary-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                />
              </svg>
            ) : isPlaying ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 5H7a1 1 0 00-1 1v12a1 1 0 001 1h3a1 1 0 001-1V6a1 1 0 00-1-1zm7 0h-3a1 1 0 00-1 1v12a1 1 0 001 1h3a1 1 0 001-1V6a1 1 0 00-1-1z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 5v14l11-7L8 5z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span>{label}</span>
          </span>
        </Button>
      </div>
      {state === 'error' && errorMessage && (
        <p className="text-xs text-error mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

