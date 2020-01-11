const glob = require('glob')

const {
	isObject,
	isString,
	isFunction
} = require('util')

const isPromise = obj => !!obj && (isObject(obj) || isFunction(obj)) && isFunction(obj.then)

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
 * const express          = require('express')
 * const cors             = require('cors')
 * const useControllers   = require('express-decorator-router/register')
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
module.exports = function useControllers (configuration = {}) {
	if (!isObject(configuration.router) && !isFunction(configuration.router))
		throw new TypeError('router must be a function or an object!')

	if (!isString(configuration.controllerExpression))
		throw new TypeError('controllerExpression must be a valid string!')

	const requestHandler = fn => (...args) => {
		const [request, response, next] = args
		try {
			const handler = fn({ request, response, next })

			if (isPromise(handler)) handler.catch(next)

		} catch (err) {
			next(err)
		}
	}

	const createControllerInstance = file => {
		const ctrl = require(file)
		const ApplicationController = ctrl.default || ctrl
		const instance = ApplicationController.prototype
			? new ApplicationController()
			: ApplicationController

		return instance.$routes.reduce((server, {
			httpMethod,
			endpointFn,
			actionPath,
			actionMiddlewares
		}) => server[httpMethod](actionPath, ...actionMiddlewares, requestHandler(instance[endpointFn].bind(instance))), configuration.router)
	}

	glob.sync(configuration.controllerExpression).map(createControllerInstance)

	return configuration.router
}
