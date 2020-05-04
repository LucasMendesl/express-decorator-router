module.exports = {
	...require('./register'),
	...require('./resolvers'),
	...require('./decorators'),
	awilix: require('awilix'),
	scopePerRequest: require('./scope-per-request'),
}
