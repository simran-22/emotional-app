import { useState, useEffect } from 'react'

export default function SupportiveToast({ message, show, duration = 3000 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!visible) return null

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-mint rounded-xl px-5 py-3 shadow-md text-sm font-semibold text-charcoal/80">
        {message}
      </div>
    </div>
  )
}
