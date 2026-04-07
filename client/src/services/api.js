const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  }

  const res = await fetch(url, config)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }))
    throw new Error(error.message)
  }
  return res.json()
}

export const api = {
  // Vents
  createVent: (text) => request('/vents', { method: 'POST', body: JSON.stringify({ text }) }),
  getVents: () => request('/vents'),
  deleteVent: (id) => request(`/vents/${id}`, { method: 'DELETE' }),

  // Voice
  uploadVoice: (blob, duration) => {
    const form = new FormData()
    form.append('audio', blob, 'recording.webm')
    form.append('duration', String(duration))
    return fetch(`${API_BASE}/voice`, { method: 'POST', body: form, credentials: 'include' }).then(r => r.json())
  },
  getVoiceList: () => request('/voice'),
  deleteVoice: (id) => request(`/voice/${id}`, { method: 'DELETE' }),

  // Listener
  sendMessage: (userMessage) => request('/listener/respond', { method: 'POST', body: JSON.stringify({ userMessage }) }),

  // Challenge
  startChallenge: () => request('/challenge/start', { method: 'POST' }),
  respondChallenge: (sessionId, userText, responseTimeMs) =>
    request('/challenge/respond', { method: 'POST', body: JSON.stringify({ sessionId, userText, responseTimeMs }) }),
  endChallenge: (sessionId) => request('/challenge/end', { method: 'POST', body: JSON.stringify({ sessionId }) }),
}
