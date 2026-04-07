const express = require('express')
const router = express.Router()
const challengeController = require('../controllers/challengeController')

router.post('/start', challengeController.start)
router.post('/respond', challengeController.respond)
router.post('/end', challengeController.end)

module.exports = router
