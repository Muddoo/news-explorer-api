const router = require('express').Router();
const { getUser } = require('../controller/users')

router.get('/me', getUser)

module.exports = router;