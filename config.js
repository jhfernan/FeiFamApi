let config = {
	businessInfo: {
		address: '2404 Woods Edge Circle, Orlando, FL 32817'
	},
	db: 'mongodb://localhost:27017/teamboxfort',
	mailer: {
		email: 'noreply@teamboxfort.com',
		password: process.env.EMAIL_PASS,
		sendEmail: 'jonathan@teamboxfort.com'
	},
	origins: 'http://localhost:3000',
	secret: 'ButByTheGraceOfGGodIAmWhatIAm,AndHisGraceTowardMeWasNotInVain.'
}

if (process.env.NODE_ENV == 'production') {
	config.db = process.env.MONGODB_URI
	config.origins = 'https://boxfort.herokuapp.com/ https://www.teamboxfort.com https://teamboxfort.com'
	config.secret = process.env.SECRET
} else {
	config.mailer = require('./hidden.config.js')
}

config.options = (origin, callback) => {
	!origin || config.origins.includes(origin)
		? callback(null, true)
		: callback(new Error('Not allowed by CORS'))
}

module.exports = config
