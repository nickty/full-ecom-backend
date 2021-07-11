const express = require('express')
const { create, listAll, remove, read, update, list, productsCount, productStar } = require('../controllers/product')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/product', authCheck, adminCheck, create)
router.get('/products/total', productsCount)

router.get('/product/:slug', read)
router.get('/products/:count', listAll)
router.delete('/product/:slug', authCheck, adminCheck, remove)

router.put('/product/:slug', authCheck, adminCheck, update)


router.post('/products', list)

//rating
router.put('/product/star/:productId', authCheck, productStar)


module.exports = router