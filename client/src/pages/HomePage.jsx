import BigButton from '../components/ui/BigButton'

const features = [
  {
    to: '/vent',
    emoji: '✍️',
    label: 'Vent It Out',
    sublabel: 'Write it all out. No one is watching.',
    color: 'bg-blush',
  },
  {
    to: '/voice',
    emoji: '🎤',
    label: 'Voice Vent',
    sublabel: 'Say it out loud. Then let it go.',
    color: 'bg-lavender',
  },
  {
    to: '/listener',
    emoji: '💬',
    label: 'Talk to AI',
    sublabel: 'A kind listener who never judges.',
    color: 'bg-skywhisper',
  },
  {
    to: '/patience',
    emoji: '😤',
    label: 'Patience Challenge',
    sublabel: 'How calm can you stay? Let\'s find out!',
    color: 'bg-peach',
  },
]

export default function HomePage() {
  return (
    <div className="py-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal mb-2">
          Just Talk
        </h1>
        <p className="text-charcoal/50 text-sm italic">
          Your safe space to feel, express, and breathe.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <BigButton key={feature.to} {...feature} />
        ))}
      </div>

      {/* Bottom Supportive Message */}
      <div className="mt-8 text-center">
        <p className="text-xs text-charcoal/40 italic">
          Everything here is private. Your feelings are yours alone.
        </p>
      </div>
    </div>
  )
}
