const { empathyPool, hindiPool } = require('../data/empathyPool')

// English keyword-based mood detection
const englishKeywords = {
  sad: ['sad', 'cry', 'alone', 'hurt', 'miss', 'lost', 'tired', 'exhausted', 'depressed', 'hopeless', 'lonely', 'empty', 'broken', 'tears'],
  angry: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'unfair', 'sick of', 'fed up', 'frustrated', 'rage', 'stupid', 'worst', 'irritated'],
  anxious: ['worried', 'scared', 'anxious', 'nervous', 'panic', 'stress', 'overwhelm', 'afraid', "can't sleep", 'restless', 'tense', 'dread'],
  happy: ['happy', 'grateful', 'glad', 'good day', 'finally', 'proud', 'excited', 'relief', 'thankful', 'joy', 'smile', 'love'],
}

// Hindi keyword-based mood detection (Hinglish + Devanagari)
const hindiKeywords = {
  sad: ['udaas', 'dukhi', 'rona', 'akela', 'akeli', 'thak', 'thaki', 'haar', 'toot', 'tooti', 'dard', 'tanhai', 'उदास', 'दुखी', 'रोना', 'अकेली', 'दर्द', 'miss kar', 'bohot bura'],
  angry: ['gussa', 'naraz', 'nafrat', 'chidh', 'pareshaan', 'galat', 'bura', 'pagal', 'irritate', 'frustrate', 'गुस्सा', 'नाराज़', 'नफरत', 'परेशान', 'tang', 'fed up'],
  anxious: ['darr', 'dar', 'tension', 'chinta', 'ghabrahat', 'neend nahi', 'soch', 'pareshan', 'डर', 'चिंता', 'घबराहट', 'टेंशन', 'nahi ho raha'],
  happy: ['khush', 'khushi', 'accha', 'maza', 'proud', 'relief', 'sukoon', 'खुश', 'खुशी', 'अच्छा', 'सुकून', 'finally'],
}

// Detect if the message is in Hindi (Hinglish or Devanagari)
function isHindi(text) {
  const lower = text.toLowerCase()
  // Check for Devanagari script
  if (/[\u0900-\u097F]/.test(text)) return true
  // Check for common Hindi/Hinglish words
  const hindiMarkers = ['mein', 'main', 'hoon', 'hai', 'hain', 'kya', 'kaise', 'karo', 'kar', 'raha', 'rahi', 'nahi', 'nahin', 'mujhe', 'tum', 'tumhe', 'aap', 'yeh', 'woh', 'bohot', 'bahut', 'accha', 'theek', 'hindi', 'baat', 'batao', 'bol', 'bolo', 'suno', 'sunao', 'kuch', 'abhi', 'meri', 'tera', 'tumhara', 'haan', 'ji']
  const matches = hindiMarkers.filter((w) => lower.includes(w)).length
  return matches >= 1
}

function detectMood(text, isHindiMsg) {
  const lower = text.toLowerCase()
  const keywords = isHindiMsg ? hindiKeywords : englishKeywords
  const scores = {}

  for (const [mood, words] of Object.entries(keywords)) {
    scores[mood] = words.filter((w) => lower.includes(w)).length
  }

  // Also check English keywords even in Hindi mode (for Hinglish mixing)
  if (isHindiMsg) {
    for (const [mood, words] of Object.entries(englishKeywords)) {
      scores[mood] = (scores[mood] || 0) + words.filter((w) => lower.includes(w)).length
    }
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

  const hindiMode = isHindi(userMessage)
  const mood = detectMood(userMessage, hindiMode)
  const responsePool = hindiMode ? hindiPool : empathyPool
  const pool = responsePool[mood]

  // Avoid repeating recent responses
  const sessionKey = req.anonymousId + (hindiMode ? '_hi' : '_en')
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
