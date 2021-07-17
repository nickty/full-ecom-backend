const express = require('express')
const { createPaymentIntent } = require('../controllers/stripe')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/auth')

router.post('/create-payment-intent', authCheck, createPaymentIntent)

module.exports = router