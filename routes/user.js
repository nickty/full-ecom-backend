const express = require('express')
const { userCart, getCart, emptyCart, saveAddress, applyCouponToUserCart, createOrder, orders } = require('../controllers/user')
const { authCheck } = require('../middlewares/auth')

const router = express.Router()

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getCart)
router.delete('/user/cart', authCheck, emptyCart)
router.post('/user/address', authCheck, saveAddress)

router.post('/user/cart/coupon', authCheck, applyCouponToUserCart)

router.post('/user/order', authCheck, createOrder)

router.get('/user/orders', authCheck, orders)

module.exports = router