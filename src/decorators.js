const {
	isString,
	isFunction
}  =  require('util')

const serverMethods   = [ 'get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all' ]

const extractDecoratorParams = args => {
	let [ argValue,  ...middlewares ] = args
	let mainPath = ''

	if (isString(argValue)) mainPath = argValue

	if (isFunction(argValue)) middlewares = [argValue, ...middlewares]

	if (argValue && mainPath === '' && middlewares.length === 0) throw new TypeError('The first argument is not a valid string path or middleware function')

	if (!middlewares.every(isFunction)) throw new TypeError('invalid type, middleware must be a function')

	return [ mainPath, middlewares ]
}

const createMetadataMapper = (rootPath, controllerMiddlewares) => metadataItem => {
	const [ endpointFn, metadata ] = metadataItem

	const {
		path,
		httpMethod,
		middlewares
	} = metadata

	const actionPath = `${rootPath}${path || ''}`
	const actionMiddlewares = controllerMiddlewares.concat(middlewares)

	if (actionPath === '') throw new Error('actionPath cannot be empty')

	return {
		httpMethod,
		endpointFn,
		actionPath,
		actionMiddlewares
	}
}

/**
 * Responsible to create a valid express routing method, adding metadata routes to object or prototype.
 * This method is used with controller decorator.
 *
 * @param  {String} method represents a valid express routing method
 * @param  {Function} [args=[]] represents a middleware collection to pass into express router
 * @returns {Function}  this method returns a function receiving the target object with a function name to decorate
 */
const route = (method, ...args) => {

	if (!isString(method)) throw new TypeError('httpMethod must be a string')

	if (!serverMethods.includes(method.toLowerCase())) throw new Error('method must be a valid express routing function')

	const [ path, middlewares ] = extractDecoratorParams(args)

	return function (target, property) {
		if (!target[property])
			throw new Error(`a property ${property} doesn't exists in target object`)

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
 *    get: route('get') //or use get()
 * })
 *
 * //literal object based
 * const getFunction = (req, res) => res.json({ message: 'my message' })
 *
 * module.exports = controller('/my-new-controller', ...anyMiddlewareCollection)({
 *     getFunction
 * }, {
 *     getFunction: route('get') //or use get()
 * })
 */
const controller = (controllerPath = '', ...middlewares) => {
	if (!isString(controllerPath)) throw new TypeError('controllerPath is not a valid string')

	return function (target, handler) {
		const proto     = target.prototype || target
		Object.keys(handler)
			.forEach(property => handler[property](proto, property))

		proto.$routes   = proto.$metadata ?
			[...proto.$metadata.entries()]
				.map(createMetadataMapper(controllerPath || '', middlewares)) :
			[]

		return target
	}
}

serverMethods.forEach(method => exports[method === 'delete' ? 'del' : method] = route.bind(null, method))

exports.route = route
exports.controller = controller
