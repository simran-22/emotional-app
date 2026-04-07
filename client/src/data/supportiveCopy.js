export const supportiveMessages = [
  "You are doing better than you think.",
  "It's okay to not be okay.",
  "Your feelings are valid, always.",
  "Taking a moment for yourself is strength.",
  "You matter more than you know.",
  "Breathe. You've got this.",
  "Being honest with yourself takes courage.",
  "You deserve kindness — especially from yourself.",
]

export const getRandomSupportive = () => {
  return supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)]
}
