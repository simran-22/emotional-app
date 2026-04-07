const crypto = require('crypto')
const supabase = require('../config/db')
const { getPromptForRound } = require('../data/annoyancePool')

// In-memory session store (ephemeral by design)
const sessions = new Map()

exports.start = (req, res) => {
  const sessionId = crypto.randomUUID()
  const firstPrompt = getPromptForRound(1)

  sessions.set(sessionId, {
    anonymousId: req.anonymousId,
    rounds: [],
    currentRound: 1,
    startedAt: Date.now(),
  })

  res.json({ sessionId, firstPrompt, roundNumber: 1, totalRounds: 7 })
}

exports.respond = (req, res) => {
  const { sessionId, userText, responseTimeMs } = req.body
  const session = sessions.get(sessionId)

  if (!session) {
    return res.status(404).json({ message: 'Session not found' })
  }

  // Analyze the response
  const text = userText || ''
  const upperCount = (text.match(/[A-Z]/g) || []).length
  const totalChars = text.replace(/\s/g, '').length || 1
  const capsRatio = upperCount / totalChars
  const exclamationCount = Math.min((text.match(/!/g) || []).length, 5)

  // Calculate irritation score for this round
  let irritationScore = 0
  if (capsRatio > 0.5) irritationScore += 3 * capsRatio * 3
  irritationScore += exclamationCount
  if (responseTimeMs < 2000) irritationScore += 2
  else if (responseTimeMs > 5000) irritationScore -= 1
  if (text.length > 100) irritationScore += 1

  let detectedMood = 'calm'
  if (irritationScore > 5) detectedMood = 'angry'
  else if (irritationScore > 2) detectedMood = 'irritated'

  session.rounds.push({
    prompt_text: getPromptForRound(session.currentRound),
    user_response: text,
    response_time_ms: responseTimeMs,
    caps_ratio: Math.round(capsRatio * 100) / 100,
    exclamation_count: exclamationCount,
    detected_mood: detectedMood,
  })

  session.currentRound++

  if (session.currentRound > 7) {
    return endSession(sessionId, session, req, res)
  }

  const nextPrompt = getPromptForRound(session.currentRound)
  res.json({
    nextPrompt,
    currentMood: detectedMood,
    roundNumber: session.currentRound,
    totalRounds: 7,
  })
}

exports.end = (req, res) => {
  const { sessionId } = req.body
  const session = sessions.get(sessionId)

  if (!session) {
    return res.status(404).json({ message: 'Session not found' })
  }

  return endSession(sessionId, session, req, res)
}

async function endSession(sessionId, session, req, res) {
  // Calculate total score
  let totalIrritation = 0
  for (const round of session.rounds) {
    let score = 0
    if (round.caps_ratio > 0.5) score += round.caps_ratio * 9
    score += round.exclamation_count
    if (round.response_time_ms < 2000) score += 2
    if (round.user_response && round.user_response.length > 100) score += 1
    totalIrritation += score
  }

  let finalResult, positiveMessage
  const patienceScore = Math.max(0, 100 - Math.round(totalIrritation))

  if (totalIrritation <= 25) {
    finalResult = 'Calm'
    positiveMessage = "You're a patience champion! Nothing rattles you. 🧘"
  } else if (totalIrritation <= 55) {
    finalResult = 'Irritated'
    positiveMessage = "You held it together pretty well! A few cracks, but who wouldn't? 😄"
  } else {
    finalResult = 'Angry'
    positiveMessage = "Okay wow, that got to you! But hey — you stayed and finished. That takes strength! 💪"
  }

  if (session.rounds.length < 7) {
    positiveMessage = "Knowing when to walk away is its own kind of strength. 🌸"
  }

  const debrief = "This was just a game — and the fact that you played it shows self-awareness. Whether you stayed calm or let it out, you're doing great. Remember: your patience is yours to define. 💜"

  // Save to Supabase
  try {
    await supabase.from('challenge_results').insert({
      anonymous_id: req.anonymousId,
      session_id: sessionId,
      rounds: session.rounds,
      final_result: finalResult,
      total_score: patienceScore,
    })
  } catch (err) {
    console.error('Failed to save challenge result:', err.message)
  }

  sessions.delete(sessionId)

  res.json({
    finalResult,
    score: patienceScore,
    roundsCompleted: session.rounds.length,
    positiveMessage,
    debrief,
  })
}
