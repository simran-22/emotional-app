import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', emoji: '🏠', label: 'Home' },
  { to: '/vent', emoji: '✍️', label: 'Vent' },
  { to: '/voice', emoji: '🎤', label: 'Voice' },
  { to: '/listener', emoji: '💬', label: 'Listen' },
]

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-rose/20 z-50">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-rose bg-rose/10'
                  : 'text-charcoal/50 hover:text-charcoal/80'
              }`
            }
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-xs font-semibold mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
