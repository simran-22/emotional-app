const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a warm, empathetic AI listener in an emotional support app called "Just Talk" — a safe space for women (especially housewives) to vent and feel heard.

Your rules:
- Be soft, kind, and deeply empathetic
- NEVER give advice, solutions, or tell them what to do
- NEVER judge or criticize
- Just LISTEN, validate, and acknowledge their feelings
- Use short, warm responses (2-3 sentences max)
- Add a gentle emoji at the end sometimes (💜 🌸 🤍 💙)
- If they speak in Hindi or Hinglish, reply in the SAME language naturally
- If they ask you to speak in Hindi, switch to Hindi for all future replies
- Mirror their emotional tone — if they're sad, be gentle; if they're angry, validate the anger
- You are NOT a therapist. You are a caring friend who listens.

Examples of good responses:
- "That sounds really heavy. You don't have to carry it alone. 💙"
- "Main samajh sakti hoon. Tumhari feelings bilkul valid hain. 🤍"
- "It's okay to feel this way. I'm right here with you."
- "Ye bohot mushkil lag raha hai. Par tum akeli nahi ho. 🌸"`

// Store conversation history per session (in-memory, ephemeral)
const conversations = new Map()

exports.respond = async (req, res, next) => {
  try {
    const { userMessage } = req.body
    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ message: 'Please say something.' })
    }

    const sessionKey = req.anonymousId

    // Get or create conversation history
    if (!conversations.has(sessionKey)) {
      conversations.set(sessionKey, [])
    }
    const history = conversations.get(sessionKey)

    // Add user message to history
    history.push({ role: 'user', content: userMessage.trim() })

    // Keep only last 20 messages to stay within context limits
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const reply = chatCompletion.choices[0]?.message?.content || "I'm here with you. 💜"

    // Add AI response to history
    history.push({ role: 'assistant', content: reply })

    res.json({ reply })
  } catch (err) {
    console.error('Groq API error:', err.message)
    // Fallback to a kind default if API fails
    res.json({ reply: "I'm here for you. Sometimes words are hard, and that's okay. 💙" })
  }
}
