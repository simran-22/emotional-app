const express = require('express')
const router = express.Router()
const listenerController = require('../controllers/listenerController')

router.post('/respond', listenerController.respond)

module.exports = router
