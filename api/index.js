const app = require('../server/src/index')

// Vercel serverless handler
module.exports = (req, res) => {
  app(req, res)
}
