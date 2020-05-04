const { isClass, isFunction } = require('awilix/lib/utils')

const isString = value => typeof value === 'string'

const isObject = value => value !== null && typeof value === 'object'

/* istanbul ignore next */
const isPromise = obj => obj && (isObject(obj) || isFunction(obj)) && isFunction(obj.then)

const isEmptyString = value => isString(value) && value === ''

module.exports = {
	isClass,
	isString,
	isObject,
	isPromise,
	isFunction,
	isEmptyString
}
