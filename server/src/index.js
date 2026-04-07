const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Only load dotenv locally (Vercel injects env vars automatically)
try { require('dotenv').config() } catch {}

// Validate Supabase config on startup
require('./config/db')

const anonymousId = require('./middleware/anonymousId')
const errorHandler = require('./middleware/errorHandler')

const ventRoutes = require('./routes/ventRoutes')
const voiceRoutes = require('./routes/voiceRoutes')
const listenerRoutes = require('./routes/listenerRoutes')
const challengeRoutes = require('./routes/challengeRoutes')

const app = express()

// Middleware — allow all origins in production (single deployment serves both)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(anonymousId)

// Routes
app.use('/api/vents', ventRoutes)
app.use('/api/voice', voiceRoutes)
app.use('/api/listener', listenerRoutes)
app.use('/api/challenge', challengeRoutes)

// Error handler
app.use(errorHandler)

// Export for Vercel serverless
module.exports = app

// Local dev: start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
