module.exports = (req, res) => {
  try {
    const app = require('../server/src/index')
    res.json({ ok: true, type: typeof app })
  } catch (e) {
    res.json({ ok: false, error: e.message, stack: e.stack.split('\n').slice(0, 8) })
  }
}
