const {
	isClass,
	isString,
	isObject,
	isFunction,
	isEmptyString
} = require('./type-is')

const extractDecoratorParams = args => {
	let [argValue, ...middlewares] = args
	let mainPath = ''

	if (isString(argValue)) mainPath = argValue

	if (isFunction(argValue)) middlewares = [argValue, ...middlewares]

	if (argValue && !isString(argValue) && middlewares.length === 0) throw new TypeError('The first argument is not a valid string path or middleware function')

	if (!middlewares.every(isFunction)) throw new TypeError('invalid type, middleware must be a function')

	return [mainPath, middlewares]
}

const createMetadataMapper = (rootPath, controllerMiddlewares) => metadataItem => {
	const [endpointFn, metadata] = metadataItem

	const {
		path,
		httpMethod,
		middlewares
	} = metadata

	const actionPath = `${rootPath}${path || ''}`
	const actionMiddlewares = controllerMiddlewares.concat(middlewares)

	if (isEmptyString(actionPath)) throw new Error('actionPath cannot be empty')

	return {
		httpMethod,
		endpointFn,
		actionPath,
		actionMiddlewares
	}
}

const route = (method, ...args) => {

	const [path, middlewares] = extractDecoratorParams(args)

	return function(target, property) {
		if (!isFunction(target) && !isObject(target))
			throw new TypeError('target must be a function or object')

		if (isObject(target) && !target[property])
			throw new Error(`a property ${property} doesn't exist in target object`)

		if (!target['$metadata'])
			target.$metadata = new Map()

		target.$metadata.set(property, { httpMethod: method, path, middlewares })

	}
}


/**
 * Responsible to define a object or object prototype as a controller.
 * This method creates a high order function (HoF) to specify a route
 * metadata and apply into controller.
 *
 * @param {String} controllerRootPath represents a controller root path
 * @param {Function[]} [middlewares=[]] represents a middleware collection that will be applied in all methods in controller
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 * @example
 * //prototype based
 * class MyController {
 *     constructor(server) { this.myDependency = server.myDependecy }
 *
 *     get(req, res){ res.json(this.myDependency.myList) }
 * }
 *
 * module.exports = controller('/my-controller', ...anyMiddlewareCollection)(MyController, {
 *    get: get()
 * })
 *
 * //literal object based
 * const getFunction = (req, res) => res.json({ message: 'my message' })
 *
 * module.exports = controller('/my-new-controller', ...anyMiddlewareCollection)({
 *     getFunction
 * }, {
 *     getFunction: get()
 * })
 *
 * //if uses awilix container
 * function controllerFactory({ controllerService }) {
 *     const endpoint = (req, res) => {
 *         res.json(controllerService.get())
 *     }
 *
 *     return { endpoint }
 * }
 *
 * module.exports = controller('/new-controller')(controllerFactory, { endpoint: get() })
 */
const controller = (controllerPath = '', ...middlewares) => {
	if (!isString(controllerPath)) throw new TypeError('controllerPath is not a valid string')

	return function(target, handler) {
		const proto = isClass(target) ? target.prototype : target

		Object.keys(handler)
			.forEach(property => handler[property](proto, property))

		target.$routes = proto.$metadata ? [...proto.$metadata.entries()]
			.map(createMetadataMapper(controllerPath || '', middlewares)) : []

		return target
	}
}


/**
 * Creates a all routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.all = route.bind(null, 'all')

/**
 * Creates a get routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.get = route.bind(null, 'get')

/**
 * Creates a put routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.put = route.bind(null, 'put')

/**
 * Creates a post routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.post = route.bind(null, 'post')

/**
 * Creates a head routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.head = route.bind(null, 'head')

/**
 * Creates a delete routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.del = route.bind(null, 'delete')

/**
 * Creates a patch routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.patch = route.bind(null, 'patch')

/**
 * Creates a options routing method.
 * This method is used with controller decorator.
 *
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
exports.options = route.bind(null, 'options')

exports.controller = controller
