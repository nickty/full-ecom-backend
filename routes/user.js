const express = require('express')
const { userCart } = require('../controllers/user')
const { authCheck } = require('../middlewares/auth')

const router = express.Router()

router.post('/cart', authCheck, userCart)

module.exports = router