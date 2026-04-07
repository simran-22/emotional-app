const empathyPool = require('../data/empathyPool')

// Simple keyword-based mood detection
const keywords = {
  sad: ['sad', 'cry', 'alone', 'hurt', 'miss', 'lost', 'tired', 'exhausted', 'depressed', 'hopeless', 'lonely', 'empty', 'broken', 'tears'],
  angry: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'unfair', 'sick of', 'fed up', 'frustrated', 'rage', 'stupid', 'worst', 'irritated'],
  anxious: ['worried', 'scared', 'anxious', 'nervous', 'panic', 'stress', 'overwhelm', 'afraid', "can't sleep", 'restless', 'tense', 'dread'],
  happy: ['happy', 'grateful', 'glad', 'good day', 'finally', 'proud', 'excited', 'relief', 'thankful', 'joy', 'smile', 'love'],
}

function detectMood(text) {
  const lower = text.toLowerCase()
  const scores = {}
  for (const [mood, words] of Object.entries(keywords)) {
    scores[mood] = words.filter((w) => lower.includes(w)).length
  }
  const priority = ['angry', 'sad', 'anxious', 'happy']
  let best = 'neutral'
  let bestScore = 0
  for (const mood of priority) {
    if (scores[mood] > bestScore) {
      bestScore = scores[mood]
      best = mood
    }
  }
  return best
}

// Track recent responses per session to avoid repeats
const recentResponses = new Map()

exports.respond = (req, res) => {
  const { userMessage } = req.body
  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ message: 'Please say something.' })
  }

  const mood = detectMood(userMessage)
  const pool = empathyPool[mood]

  // Avoid repeating recent responses
  const sessionKey = req.anonymousId
  const recent = recentResponses.get(sessionKey) || []
  const available = pool.filter((_, i) => !recent.includes(i))
  const usePool = available.length > 0 ? available : pool

  const reply = usePool[Math.floor(Math.random() * usePool.length)]
  const replyIndex = pool.indexOf(reply)

  // Track last 3 responses
  recent.push(replyIndex)
  if (recent.length > 3) recent.shift()
  recentResponses.set(sessionKey, recent)

  res.json({ reply, mood })
}
