const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer')
const settings = require('../../config.js')
const util = require('../../middleware/utilities')

const appCustomerReply = require('../../public/mailer/app/customer.js')
const contactSystemReply = require('../../public/mailer/contact/system.js')
const quoteSystemReply = require('../../public/mailer/quote/system.js')

const mailerOptions = {
	from: settings.mailer.email,
	to: settings.mailer.sendEmail,
	subject: 'Thank you for contacting us!',
	html: appCustomerReply(settings.mailer.email)
}
const transporter = nodemailer.createTransport({
	service: 'zoho',
	auth: { user: settings.mailer.email, pass: settings.mailer.password }
})

router.route('/api/mailer/contact')
.post(util.async(async (req, res, next) => {
	let mailOptions = { ...mailerOptions, to: req.body.email, html: appCustomerReply(req.body) }
	transporter.sendMail(mailOptions, (err, info) => {
		mailOptions = { ...mailerOptions, subject: 'Contact Submission', html: contactSystemReply(req.body) }
		transporter.sendMail(mailOptions, (err, info) => {
			res.status(200).send('Success')
		})
	})
}))

router.route('/api/mailer/quote')
.post(util.async(async (req, res, next) => {
	let mailOptions = { ...mailerOptions, to: req.body.email, subject: 'Thank you for requesting a quote!', html: appCustomerReply(req.body) }
	transporter.sendMail(mailOptions, (err, info) => {
		mailOptions = { ...mailerOptions, subject: 'Quote Requested', html: quoteSystemReply(req.body) }
		transporter.sendMail(mailOptions, (err, info) => {
			res.status(200).send('Success')
		})
	})
}))

module.exports = router
