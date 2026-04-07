const keywords = {
  sad: ['sad', 'cry', 'alone', 'hurt', 'miss', 'lost', 'tired', 'exhausted', 'depressed', 'hopeless', 'lonely', 'empty', 'broken', 'tears'],
  angry: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'unfair', 'sick of', 'fed up', 'frustrated', 'rage', 'stupid', 'worst', 'irritated'],
  anxious: ['worried', 'scared', 'anxious', 'nervous', 'panic', 'stress', 'overwhelm', 'afraid', "can't sleep", 'restless', 'tense', 'dread'],
  happy: ['happy', 'grateful', 'glad', 'good day', 'finally', 'proud', 'excited', 'relief', 'thankful', 'joy', 'smile', 'love'],
}

export default function detectMood(text) {
  const lower = text.toLowerCase()
  const scores = {}

  for (const [mood, words] of Object.entries(keywords)) {
    scores[mood] = words.filter((w) => lower.includes(w)).length
  }

  // Priority: angry > sad > anxious > happy > neutral
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
