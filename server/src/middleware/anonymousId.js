const crypto = require('crypto')

function anonymousId(req, res, next) {
  let anonId = req.cookies.jt_anon_id

  if (!anonId) {
    anonId = crypto.randomUUID()
    res.cookie('jt_anon_id', anonId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
    })
  }

  req.anonymousId = anonId
  next()
}

module.exports = anonymousId
