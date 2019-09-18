const express = require('express')
const router = express.Router()

const app = require('./app')
const mailer = require('./mailer')
const session = require('./session')

// Add API routes
router.use(app)
router.use(mailer)
router.use(session)

module.exports = router
