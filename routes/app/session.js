const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

const auth = require('../../middleware/auth')
const config = require('../../config')
const util = require('../../middleware/utilities')

const defFilter = { __v: 0 }

// Authentication handler
router.route('/api/authenticate')
.get(auth.checkToken, util.async(async (req, res, next) => {
	res.json({ user: res.decoded })
}))
.post(util.async(async (req, res, next) => {
	const user = await User.findOne({ username: req.body.username }, defFilter)
	if (!user) {
		next(util.error(404, 'Member not found'))
	} else if (!user.active) {
		next(util.error(403, 'This account is not active'))
	} else if (!user.validPassword(req.body.password, user.password)) {
		next(util.error(403, 'Bad credentials'))
	} else if (user.validPassword(req.body.password, user.password)) {
		let { password, active, ...data } = user._doc
		jwt.sign(data, config.secret, { expiresIn: '1d' }, (err, token) => {
			res.json({ token: token })
		})
	}
}))

module.exports = router
