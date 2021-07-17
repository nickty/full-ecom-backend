const express = require('express')
const { userCart, getCart, emptyCart } = require('../controllers/user')
const { authCheck } = require('../middlewares/auth')

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getCart)
router.get('/user/cart', authCheck, emptyCart)

module.exports = router