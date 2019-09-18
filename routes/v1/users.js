const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

const auth = require('../../middleware/auth')
const config = require('../../config')
const util = require('../../middleware/utilities')

const defFilter = { password: 0, __v: 0 }
const safeFilter = { _id: 0, password: 0, phone: 0, __v: 0 }
const defSort = { sort: { createdAt: 1 }}

// Make sure each request has token added to it
router.use(auth.checkToken)

// Users Actions
router.route('/users')
.get(auth.isAdmin, util.async(async (req, res, next) => {
	const users = await User.find({}, defFilter, defSort)
	res.json(users)
}))
.post(auth.isAdmin, util.async(async (req, res, next) => {
	const user = await User.create(req.body)
	res.json({ message: 'success' })
}))

// User Actions
router.route('/users/:id')
.delete(auth.isAdmin, util.async(async (req, res, next) => {
	if (req.params.id !== res.decoded._id) {
		const user = await User.findById(req.params.id)
		user.remove((err, removedUser) => {
			if (err) {
				next(err)
			}
			res.json(req.params.id)
		})
	} else {
		next(util.error(500, 'You cannot delete yourself...'))
	}
}))

// Special Actions
// router.route('/user/:username')
// .get(util.async(async (req, res, next) => {
// 	const user = await User.findOne({ username: req.params.username }, safeFilter)
// 	!user ? next(util.error(404, 'Profile not found')) : res.json(user)
// }))
// .put(util.async(async (req, res, next) => {
// 	if (res.decoded.username === req.params.username) {
// 		const user = await User.findOne({ username: req.params.username }, defFilter)
// 		let info = {}
// 		req.body.about ? info.about = req.body.about : null
// 		req.body.email ? info.email = req.body.email : null
// 		req.body.phone ? info.phone = req.body.phone : null
// 		user.set(info)
// 		user.save(err => {
// 			err ? next(err) : res.json({ message: 'Success!' })
// 		})
// 	} else {
// 		next(util.error(403, 'You cannot update another member\'s info'))
// 	}
// }))

router.route('/user/:username/update_token')
.get(util.async(async (req, res, next) => {
	if (res.decoded.username === req.params.username) {
		const user = await User.findOne({ username: req.params.username }, defFilter)
		if (!user) {
			next(util.error(404, 'Member not found'))
		} else {
			let { active, ...data } = user._doc
			res.json({ token: `Bearer ${jwt.sign(data, config.secret, { expiresIn: '1d' })}` })
		}
	} else {
		next(util.error(403, 'You cannot retrieve another member\'s info'))
	}
}))

module.exports = router
