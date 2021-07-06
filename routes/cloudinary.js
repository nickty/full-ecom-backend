const express = require('express')
const { upload, remove } = require('../controllers/cloudinary')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/uploadimages', authCheck, adminCheck, upload)
router.delete('/removeimage', authCheck, adminCheck, remove)


module.exports = router