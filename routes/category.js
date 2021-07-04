const express = require('express')
const { create, read, list, update, remove } = require('../controllers/sub')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/category', authCheck, adminCheck, create)
router.get('/category/:slug', read)
router.get('/categories', list)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)


module.exports = router