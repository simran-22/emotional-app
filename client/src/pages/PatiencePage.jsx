import { useState, useEffect } from 'react'
import { api } from '../services/api'
import useTypingAnalysis from '../hooks/useTypingAnalysis'
import SoftCard from '../components/ui/SoftCard'

export default function PatiencePage() {
  const [stage, setStage] = useState('intro') // intro | playing | result
  const [sessionId, setSessionId] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [input, setInput] = useState('')
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(7)
  const [currentMood, setCurrentMood] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const { markPromptShown, analyze } = useTypingAnalysis()

  useEffect(() => {
    if (prompt) markPromptShown()
  }, [prompt, markPromptShown])

  const handleStart = async () => {
    setLoading(true)
    try {
      const data = await api.startChallenge()
      setSessionId(data.sessionId)
      setPrompt(data.firstPrompt)
      setRound(data.roundNumber)
      setStage('playing')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async () => {
    if (!input.trim() || loading) return
    setLoading(true)

    const { responseTimeMs } = analyze(input)

    try {
      const data = await api.respondChallenge(sessionId, input, responseTimeMs)

      if (data.finalResult) {
        // Auto-ended (round 7 completed)
        setResult(data)
        setStage('result')
      } else {
        setPrompt(data.nextPrompt)
        setRound(data.roundNumber)
        setCurrentMood(data.currentMood)
      }
      setInput('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuit = async () => {
    setLoading(true)
    try {
      const data = await api.endChallenge(sessionId)
      setResult(data)
      setStage('result')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setStage('intro')
    setSessionId(null)
    setPrompt('')
    setInput('')
    setRound(0)
    setCurrentMood(null)
    setResult(null)
  }

  const getMoodColor = (mood) => {
    if (mood === 'calm') return 'bg-sage'
    if (mood === 'irritated') return 'bg-peach'
    return 'bg-coral'
  }

  const getResultEmoji = (finalResult) => {
    if (finalResult === 'Calm') return '🧘'
    if (finalResult === 'Irritated') return '😤'
    return '🔥'
  }

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Patience Challenge</h2>
        <p className="text-sm text-charcoal/50 italic mt-1">
          How calm can you stay? Let's find out!
        </p>
      </div>

      {/* Intro */}
      {stage === 'intro' && (
        <SoftCard color="bg-peach/40" className="text-center">
          <p className="text-4xl mb-4">😏</p>
          <h3 className="text-lg font-bold text-charcoal mb-2">Ready to test your patience?</h3>
          <p className="text-sm text-charcoal/60 mb-6">
            I'll try to get under your skin with 7 rounds of mildly annoying messages.
            Your job? Stay as calm as possible. I'll track how you respond!
          </p>
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-rose text-white px-8 py-3 rounded-2xl font-bold
              hover:bg-rose/80 active:scale-95 transition-all min-h-[48px]
              disabled:opacity-40"
          >
            {loading ? 'Starting...' : 'Bring It On! 💪'}
          </button>
        </SoftCard>
      )}

      {/* Playing */}
      {stage === 'playing' && (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-charcoal/60">
              Round {round}/{totalRounds}
            </span>
            {currentMood && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${getMoodColor(currentMood)}`}>
                {currentMood}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-charcoal/10 rounded-full h-2 mb-6">
            <div
              className="bg-rose h-2 rounded-full transition-all duration-500"
              style={{ width: `${((round - 1) / totalRounds) * 100}%` }}
            />
          </div>

          {/* AI Prompt */}
          <SoftCard color="bg-peach/30" className="mb-4">
            <p className="text-base text-charcoal leading-relaxed">{prompt}</p>
          </SoftCard>

          {/* User Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="w-full bg-white rounded-2xl px-4 py-3 text-sm text-charcoal
              placeholder-charcoal/30 resize-none focus:outline-none focus:ring-2
              focus:ring-rose/40 border border-charcoal/5 min-h-[80px] mb-4"
            rows={2}
          />

          <div className="flex gap-3">
            <button
              onClick={handleRespond}
              disabled={!input.trim() || loading}
              className="flex-1 bg-rose text-white py-3 rounded-2xl font-bold text-sm
                hover:bg-rose/80 active:scale-95 transition-all disabled:opacity-40 min-h-[48px]"
            >
              {loading ? 'Sending...' : 'Respond 💬'}
            </button>
            <button
              onClick={handleQuit}
              disabled={loading}
              className="bg-charcoal/10 text-charcoal/60 py-3 px-4 rounded-2xl font-semibold text-sm
                hover:bg-charcoal/20 active:scale-95 transition-all min-h-[48px]"
            >
              Stop 🛑
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {stage === 'result' && result && (
        <SoftCard color="bg-mint/40" className="text-center">
          <p className="text-5xl mb-4">{getResultEmoji(result.finalResult)}</p>
          <h3 className="text-2xl font-extrabold text-charcoal mb-2">
            {result.finalResult}
          </h3>
          <p className="text-sm text-charcoal/60 mb-2">
            Patience Score: {result.score}/100
          </p>
          <p className="text-sm text-charcoal/50 mb-2">
            Rounds completed: {result.roundsCompleted}/7
          </p>

          <div className="bg-white/60 rounded-2xl p-4 my-4">
            <p className="text-base text-charcoal font-semibold">{result.positiveMessage}</p>
          </div>

          <p className="text-xs text-charcoal/40 italic mb-6">{result.debrief}</p>

          <button
            onClick={handleRestart}
            className="bg-rose text-white px-8 py-3 rounded-2xl font-bold
              hover:bg-rose/80 active:scale-95 transition-all min-h-[48px]"
          >
            Try Again 🔄
          </button>
        </SoftCard>
      )}
    </div>
  )
}
