import { useState, useRef, useCallback, useEffect } from 'react'

export default function useVoiceRecorder() {
  const [state, setState] = useState('idle') // idle | recording | stopped
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [error, setError] = useState(null)

  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timerRef = useRef(null)

  // Cleanup on unmount (privacy-first: discard recording)
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop()
      }
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      chunks.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        setState('stopped')
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.current = recorder
      recorder.start()
      setState('recording')
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone to record.')
      setState('idle')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const deleteRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setDuration(0)
    setState('idle')
  }, [audioUrl])

  const reset = useCallback(() => {
    deleteRecording()
  }, [deleteRecording])

  return {
    state,
    duration,
    audioUrl,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    deleteRecording,
    reset,
  }
}
