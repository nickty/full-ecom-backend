const express = require('express')
const { create } = require('../controllers/product')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/product', authCheck, adminCheck, create)


module.exports = router