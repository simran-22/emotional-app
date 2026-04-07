import { Link } from 'react-router-dom'

export default function BigButton({ to, emoji, label, sublabel, color = 'bg-peach' }) {
  return (
    <Link
      to={to}
      className={`${color} rounded-2xl p-6 flex flex-col items-center text-center
        hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
        shadow-sm hover:shadow-md min-h-[140px] justify-center`}
    >
      <span className="text-4xl mb-2">{emoji}</span>
      <span className="text-lg font-bold text-charcoal">{label}</span>
      {sublabel && (
        <span className="text-xs text-charcoal/50 mt-1 italic">{sublabel}</span>
      )}
    </Link>
  )
}
