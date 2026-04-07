import { useRef, useCallback } from 'react'

export default function useTypingAnalysis() {
  const promptShownAt = useRef(null)

  const markPromptShown = useCallback(() => {
    promptShownAt.current = Date.now()
  }, [])

  const analyze = useCallback((text) => {
    const responseTimeMs = promptShownAt.current
      ? Date.now() - promptShownAt.current
      : 5000

    const upperCount = (text.match(/[A-Z]/g) || []).length
    const totalChars = text.replace(/\s/g, '').length || 1
    const capsRatio = upperCount / totalChars
    const exclamationCount = Math.min((text.match(/!/g) || []).length, 5)

    return { responseTimeMs, capsRatio, exclamationCount }
  }, [])

  return { markPromptShown, analyze }
}
