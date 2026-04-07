import { useState, useRef, useEffect } from 'react'
import { api } from '../services/api'
import SoftCard from '../components/ui/SoftCard'

export default function ListenerPage() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi there. I'm here to listen. Whatever you're feeling, you can share it here. No judgment, no advice — just someone who hears you. 💜" },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    setMessages((prev) => [...prev, { from: 'user', text }])
    setInput('')
    setSending(true)

    try {
      const { reply } = await api.sendMessage(text)
      setMessages((prev) => [...prev, { from: 'ai', text: reply }])
    } catch {
      setMessages((prev) => [...prev, { from: 'ai', text: "I'm here. Sometimes words are hard, and that's okay. 💙" }])
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="py-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-charcoal">AI Listener</h2>
        <p className="text-sm text-charcoal/50 italic">
          A kind ear that never judges.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 hide-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <SoftCard
              color={msg.from === 'user' ? 'bg-blush' : 'bg-skywhisper'}
              className={`max-w-[80%] !p-3 !rounded-2xl ${
                msg.from === 'user' ? '!rounded-br-sm' : '!rounded-bl-sm'
              }`}
            >
              <p className="text-sm text-charcoal/80 leading-relaxed">{msg.text}</p>
            </SoftCard>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <SoftCard color="bg-skywhisper" className="max-w-[80%] !p-3 !rounded-2xl !rounded-bl-sm">
              <p className="text-sm text-charcoal/40 italic">listening...</p>
            </SoftCard>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm text-charcoal
            placeholder-charcoal/30 resize-none focus:outline-none focus:ring-2
            focus:ring-rose/40 border border-charcoal/5 min-h-[48px] max-h-24"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="bg-rose text-white px-4 py-3 rounded-2xl font-bold text-sm
            hover:bg-rose/80 active:scale-95 transition-all disabled:opacity-40
            min-h-[48px] min-w-[48px]"
        >
          💬
        </button>
      </div>
    </div>
  )
}
