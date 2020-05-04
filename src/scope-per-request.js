function scopePerRequest(container) {
	return function scopePerRequestMiddleware(...args) {
		const [req, , next] = args
		req.container = container.createScope()
		return next()
	}
}

module.exports = scopePerRequest
