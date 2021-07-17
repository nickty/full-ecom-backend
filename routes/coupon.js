const express = require('express')
const { create, list, remove } = require('../controllers/coupon')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/coupon', authCheck, adminCheck, create)
router.get('/coupon', list)
router.delete('/coupon/:couponId', authCheck, adminCheck, remove)


module.exports = router