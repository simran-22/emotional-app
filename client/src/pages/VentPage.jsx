import { useState, useEffect } from 'react'
import { api } from '../services/api'
import HeardMessage from '../components/shared/HeardMessage'
import SoftCard from '../components/ui/SoftCard'
import ConfirmModal from '../components/ui/ConfirmModal'

export default function VentPage() {
  const [text, setText] = useState('')
  const [showHeard, setShowHeard] = useState(false)
  const [vents, setVents] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (showHistory) {
      api.getVents().then(setVents).catch(() => {})
    }
  }, [showHistory])

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return
    setSubmitting(true)
    try {
      await api.createVent(text)
      setText('')
      setShowHeard(Date.now()) // trigger with unique value
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.deleteVent(deleteTarget)
      setVents((prev) => prev.filter((v) => v.id !== deleteTarget))
    } catch (err) {
      console.error(err)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="py-6">
      <HeardMessage show={showHeard} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Vent It Out</h2>
        <p className="text-sm text-charcoal/50 italic mt-1">
          Write whatever you're feeling. No filter needed.
        </p>
      </div>

      <SoftCard color="bg-blush/50">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Let it all out... no one is reading this but you."
          className="w-full h-48 bg-white/60 border-none rounded-2xl p-4 text-charcoal
            placeholder-charcoal/30 resize-none focus:outline-none focus:ring-2
            focus:ring-rose/40 text-base leading-relaxed"
          maxLength={5000}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-charcoal/30">{text.length}/5000</span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="bg-rose text-white px-6 py-3 rounded-2xl font-bold text-sm
              hover:bg-rose/80 active:scale-95 transition-all disabled:opacity-40
              disabled:cursor-not-allowed min-h-[48px]"
          >
            {submitting ? 'Sending...' : 'Let It Go 💜'}
          </button>
        </div>
      </SoftCard>

      {/* History Toggle */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-charcoal/40 hover:text-charcoal/60 underline transition-colors"
        >
          {showHistory ? 'Hide past vents' : 'View past vents'}
        </button>
      </div>

      {/* Vent History */}
      {showHistory && (
        <div className="mt-4 space-y-3">
          {vents.length === 0 ? (
            <p className="text-center text-sm text-charcoal/30 italic">
              No vents yet. This space is waiting for you.
            </p>
          ) : (
            vents.map((vent) => (
              <SoftCard key={vent.id} color="bg-white" className="relative">
                <p className="text-sm text-charcoal/70 pr-8">{vent.text}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-charcoal/30">
                    {new Date(vent.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(vent.id)}
                    className="text-xs text-coral hover:text-coral/70 font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </SoftCard>
            ))
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this vent?"
        message="This will be permanently removed. You can always write a new one."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
