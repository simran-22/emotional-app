const express = require('express')
const router = express.Router()
const ventController = require('../controllers/ventController')

router.post('/', ventController.create)
router.get('/', ventController.getAll)
router.delete('/:id', ventController.remove)

module.exports = router
