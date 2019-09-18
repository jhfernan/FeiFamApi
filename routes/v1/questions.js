const express = require('express')
const router = express.Router()

const Question = require('../../models/question')
const User = require('../../models/user')

const auth = require('../../middleware/auth')
const util = require('../../middleware/utilities')

const authFilter = {
	email: 1,
	last: 1,
	mi: 1,
	name: 1,
	teacher: 1,
	teachingAssistant: 1,
	username: 1
}
const defFilter = { __v: 0 }
const defSort = { sort: { createdAt: -1 }}

// Make sure each request has token added to it
router.use(auth.checkToken)

// Questions all and create routes
router.route('/questions')
.get(util.async(async (req, res, next) => {
	const questions = await Question.find({}, defFilter, defSort)
		.populate('_author', authFilter)
	res.json(questions)
}))
.post(util.async(async (req, res, next) => {
	let data = req.body
	data._author = res.decoded.id
	const question = await Question.create(data)
	res.json(question)
}))

// Questions one, update and delete routes
router.route('/questions/:id')
.get(util.async(async (req, res, next) => {
	const question = await Question.findById(req.params.id, defFilter)
		.populate('_author', authFilter)
		.populate('answers._author', authFilter)
		.populate('comments._author', authFilter)
	res.json(question)
}))

module.exports = router
