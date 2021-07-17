const express = require('express')
const { userCart, getCart } = require('../controllers/user')
const { authCheck } = require('../middlewares/auth')

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getCart)

module.exports = router