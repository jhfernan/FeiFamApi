const express = require('express')
const router = express.Router()

// const questions = require('./questions')
const users = require('./users')

// Add API routes
// router.use(questions)
router.use(users)

module.exports = router
