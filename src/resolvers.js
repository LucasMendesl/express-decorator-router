const assert = require('assert')
const { isClass } = require('awilix/lib/utils')
const { isFunction, isString } = require('./type-is')
const { asClass, asFunction, asValue } = require('awilix')

const createResolver = (resolver, options) => {
	if (isClass(resolver)) return createRouteResolver(asClass(resolver, options))
	if (isFunction(resolver)) return createRouteResolver(asFunction(resolver, options))

	return createRouteResolver(asValue(resolver, options))
}

const createRouteResolver = resolver => methodToInvoke => (...args) => {
	const [req] = args
	const { container } = req
	const resolved = container.build(resolver)

	assert(methodToInvoke,
		`methodToInvoke must be a valid method type, such as string, number or symbol, but was ${String(methodToInvoke)}`)

	const resolvedWithContext = resolved[methodToInvoke].bind(resolved)
	return resolvedWithContext(...args)
}

const injectFactory = classOrFunctionName => ({
	[classOrFunctionName]: dependency
}) => (req, _, next) => {
	req[classOrFunctionName] = dependency
	return next()
}

const inject = factory => {
	const resolver = getResolver(isString(factory) ? injectFactory(factory) : factory)
	return function middlewareFactoryHandler(...args) {
		const [req] = args
		const { container } = req
		const resolved = container.build(resolver)
		return resolved(...args)
	}
}

/* istanbul ignore next */
const getResolver = arg => isFunction(arg) ? asFunction(arg) : arg

module.exports = {
	inject,
	createResolver
}
