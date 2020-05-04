const glob = require('glob')

const {
	isClass,
	isObject,
	isString,
	isPromise,
	isFunction,
} = require('./type-is')

const { createResolver } = require('./resolvers')

const registerControllers = ({ router, controllerExpression }, handler, useAwilix) => {
	if (!isObject(router) && !isFunction(router))
		throw new TypeError('router must be a function or an object!')

	if (!isString(controllerExpression))
		throw new TypeError('controllerExpression must be a valid string!')

	const requestHandler = fn => (...args) => {
		const [request, response, next] = args
		try {
			const handler = useAwilix ? fn(...args) : fn({ request, response, next })

			if (isPromise(handler)) handler.catch(next)

		} catch (err) {
			next(err)
		}
	}

	const createControllerInstance = (router, handler) => file => {
		const required = require(file)
		const controller = required.default || required

		const routes = controller.$routes || []
		return routes.reduce((server, {
			httpMethod,
			endpointFn,
			actionPath,
			actionMiddlewares
		}) => server[httpMethod](actionPath, ...actionMiddlewares, requestHandler(handler(controller, endpointFn))), router)
	}

	glob.sync(controllerExpression)
		.forEach(createControllerInstance(router, handler))

	return router
}


/**
 * Responsible to register controllers into express router and resolves
 * controller dependencies with awilix.
 * This method uses glob pattern to search files on application.
 *
 * @param {Object}  configuration represents a configuration object
 * @param  {Function} configuration.router represents a express router
 * @param  {String} configuration.controllerExpression represents a glob expression to match controller files on application
 * @returns This method returns a configured router object
 * @example
 *
 * const express  = require('express')
 * const cors     = require('cors')
 * const service  = require('./my-service')
 * const {
 *    awilix,
 *    scopePerRequest,
 *    useAwilixControllers
 * }  = require('express-decorator-router')
 *
 * const container        = awilix.createContainer()
 *
 * const app              = express()
 * const router           = express.Router()
 *
 * container.register({
 *    myService: awilix.asFunction(service).scoped()
 * })
 *
 * app.use(cors())
 * app.use(express.json())
 * app.use(scopePerRequest(container))
 * app.use('/api', useAwilixControllers({
 *     router,
 *     controllerExpression: `${__dirname}\**\controller.js`
 * }))
 *
 */
exports.useAwilixControllers = (configuration = {}) => {
	const resolver = (controller, method) => createResolver(controller)(method)

	return registerControllers(configuration, resolver, true)
}


/**
 * Responsible to register controllers into express router.
 * This method uses glob pattern to search files on application.
 *
 * @param {Object}  configuration represents a configuration object
 * @param  {Function} configuration.router represents a express router
 * @param  {String} configuration.controllerExpression represents a glob expression to match controller files on application
 * @returns This method returns a configured router object
 * @example
 *
 * const express              = require('express')
 * const cors                 = require('cors')
 * const { useControllers }   = require('express-decorator-router')
 *
 * const app              = express()
 * const router           = express.Router()
 *
 * app.use(cors())
 * app.use(express.json())
 * app.use('/api', useControllers({
 *     router,
 *     controllerExpression: `${__dirname}\**\controller.js`
 * }))
 *
 */
exports.useControllers = (configuration = {}) => {

	const resolver = (controller, method) => {
		const instance = isClass(controller) ? new controller() : controller
		return instance[method].bind(instance)
	}

	return registerControllers(configuration, resolver, false)
}
