const express = require('express')
const { create, read, list, update, remove } = require('../controllers/category')
const { authCheck, adminCheck } = require('../middlewares/auth')
const router = express.Router()

router.post('/sub', authCheck, adminCheck, create)
router.get('/sub/:slug', read)
router.get('/subs', list)
router.put('/sub/:slug', authCheck, adminCheck, update)
router.delete('/sub/:slug', authCheck, adminCheck, remove)


module.exports = router