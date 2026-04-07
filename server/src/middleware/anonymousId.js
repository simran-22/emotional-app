const { v4: uuidv4 } = require('uuid')

function anonymousId(req, res, next) {
  let anonId = req.cookies.jt_anon_id

  if (!anonId) {
    anonId = uuidv4()
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
