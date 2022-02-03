const { inject } = require('./resolvers')

module.exports = {
	...require('./register'),
	...require('./decorators'),
	inject,
	awilix: require('awilix'),
	scopePerRequest: require('./scope-per-request'),
}
