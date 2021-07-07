const express = require('express')
const { create, listAll } = require('../controllers/product')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/product', authCheck, adminCheck, create)
router.get('/products/:count', listAll)
router.delete('/product/:slug', authCheck, adminCheck, remove)


module.exports = router