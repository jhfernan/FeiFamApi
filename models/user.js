const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'First name is required',
		lowercase: true,
		trim: true,
		maxlength: 15
	},
	mi: {
		type: String,
		lowercase: true,
		trim: true,
		maxlength: 1
	},
	last: {
		type: String,
		required: 'Last name is required',
		lowercase: true,
		trim: true,
		maxlength: 15
	},

	active: { type: Boolean, default: true },
	username: {
		type: String,
		unique: [true, 'The username you supplied is already in use'],
		required: 'The username is required',
		lowercase: true,
		trim: true,
		minlength: [5, 'The username must be at least 5 characters'],
		maxlength: [20, 'The username cannot be more than 20 characters']
	},
	password: {
		type: String,
		required: 'The password is required',
		minlength: [5, 'Your password must be at least 5 characters long'],
		maxlength: [20, 'The username cannot be more than 20 characters']
	},

	email: {
		type: String,
		required: 'The email is required',
		trim: true,
		unique: [true, 'The email you supplied is already in use']
	},
	phone: {
		type: String,
		trim: true
	},

	about: {
		type: String,
		maxlength: [100, 'The "about me" cannot be more than 100 characters']
	},
	links: [String],

	admin: { type: Boolean, default: false },
	manager: { type: Boolean, default: false },
	staff: { type: Boolean, default: false },
	member: { type: Boolean, default: false },

	title: {
		type: String,
		trim: true
	},

	createdAt: {
		type: Date,
		default: Date.now
	}
})

UserSchema.pre('save', function(next) {
	let user = this
	if (user.isModified('password')) {
		user.password = bcrypt.hashSync(user.password, 10)
	}
	next()
})

UserSchema.methods.validPassword = (password, userPassword) => {
	return bcrypt.compareSync(password, userPassword)
}

const User = mongoose.model('User', UserSchema)
module.exports = User
