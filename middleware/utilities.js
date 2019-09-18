const utilities = {
	async: fn => (req, res, next) => {
		Promise
			.resolve(fn(req, res, next))
			.catch(next)
	},

	error: (status, message) => {
		let err = new Error(message)
		err.status = status
		return err
	},
}

module.exports = utilities
