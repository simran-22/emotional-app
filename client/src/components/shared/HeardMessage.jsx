import { useState, useEffect } from 'react'

export default function HeardMessage({ show }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg
        animate-[fadeIn_0.3s_ease-out] text-center">
        <p className="text-2xl mb-2">💜</p>
        <p className="text-xl font-bold text-charcoal">You are heard</p>
        <p className="text-sm text-charcoal/50 mt-1">Your feelings matter</p>
      </div>
    </div>
  )
}
