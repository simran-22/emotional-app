import { useState } from 'react'
import useVoiceRecorder from '../hooks/useVoiceRecorder'
import { api } from '../services/api'
import SoftCard from '../components/ui/SoftCard'
import SupportiveToast from '../components/shared/SupportiveToast'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function VoiceVentPage() {
  const { state, duration, audioUrl, audioBlob, error, startRecording, stopRecording, deleteRecording } = useVoiceRecorder()
  const [toast, setToast] = useState({ show: false, message: '' })
  const [saving, setSaving] = useState(false)

  const showToast = (message) => {
    setToast({ show: Date.now(), message })
  }

  const handleSave = async () => {
    if (!audioBlob || saving) return
    setSaving(true)
    try {
      await api.uploadVoice(audioBlob, duration)
      showToast('Saved safely 🤍')
      deleteRecording()
    } catch (err) {
      showToast('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    deleteRecording()
    showToast('Recording discarded. Nothing was saved. 🤍')
  }

  return (
    <div className="py-6">
      <SupportiveToast message={toast.message} show={toast.show} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Voice Vent</h2>
        <p className="text-sm text-charcoal/50 italic mt-1">
          Say it out loud. Then let it go.
        </p>
      </div>

      <SoftCard color="bg-lavender/40" className="text-center">
        {/* Recording State */}
        {state === 'idle' && (
          <div>
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-rose text-white text-4xl
                hover:bg-rose/80 active:scale-95 transition-all shadow-lg mx-auto
                flex items-center justify-center"
            >
              🎤
            </button>
            <p className="text-sm text-charcoal/50 mt-4">
              Tap to start recording
            </p>
            {error && (
              <p className="text-sm text-coral mt-2">{error}</p>
            )}
          </div>
        )}

        {state === 'recording' && (
          <div>
            <div className="w-24 h-24 rounded-full bg-coral text-white text-4xl
              mx-auto flex items-center justify-center animate-pulse">
              🔴
            </div>
            <p className="text-2xl font-bold text-charcoal mt-4">{formatTime(duration)}</p>
            <p className="text-sm text-charcoal/50 mt-1">Recording... let it all out</p>
            <button
              onClick={stopRecording}
              className="mt-4 bg-charcoal text-white px-6 py-3 rounded-2xl font-bold text-sm
                hover:bg-charcoal/80 active:scale-95 transition-all min-h-[48px]"
            >
              Stop Recording ⏹️
            </button>
          </div>
        )}

        {state === 'stopped' && (
          <div>
            <p className="text-lg font-bold text-charcoal mb-2">Recording Complete</p>
            <p className="text-sm text-charcoal/40 mb-4">Duration: {formatTime(duration)}</p>

            {/* Playback */}
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full mb-4 rounded-xl" />
            )}

            <p className="text-xs text-charcoal/40 italic mb-4">
              This recording stays on your device unless you choose to save it.
            </p>

            {/* Actions - Delete is primary (privacy first) */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="bg-coral text-white px-6 py-3 rounded-2xl font-bold text-sm
                  hover:bg-coral/80 active:scale-95 transition-all min-h-[48px]"
              >
                Delete Recording (Default) 🗑️
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-charcoal/60 px-6 py-3 rounded-2xl font-semibold text-sm
                  border border-charcoal/10 hover:bg-gray-50 active:scale-95 transition-all
                  min-h-[48px] disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save if you want 💾'}
              </button>
            </div>
          </div>
        )}
      </SoftCard>

      <div className="mt-6 text-center">
        <p className="text-xs text-charcoal/30 italic">
          Your voice, your choice. Nothing is saved unless you say so.
        </p>
      </div>
    </div>
  )
}
