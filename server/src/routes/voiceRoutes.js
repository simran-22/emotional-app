const express = require('express')
const router = express.Router()
const multer = require('multer')
const voiceController = require('../controllers/voiceController')

// Use memory storage (no disk) — works on Vercel serverless
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
})

router.post('/', upload.single('audio'), voiceController.upload)
router.get('/', voiceController.getAll)
router.get('/:id/play', voiceController.play)
router.delete('/:id', voiceController.remove)

module.exports = router
