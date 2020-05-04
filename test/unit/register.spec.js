/* eslint-disable no-undef */
const { expect } = require('chai')
const {
	useControllers,
	useAwilixControllers
} = require('../../src/register')

const noop = () => {}

describe('express routing decorators - register', () => {

	it('should throw error when pass invalid router parameter', () => {
		expect(() => {
			useControllers()
		}).to.throw('router must be a function or an object!')

		expect(() => {
			useAwilixControllers()
		}).to.throw('router must be a function or an object!')

	})

	it('should throw error when pass invalid expression to find controllers', () => {
		expect(() => {
			useControllers({ router: noop })
		}).to.throw('controllerExpression must be a valid string!')

		expect(() => {
			useAwilixControllers({ router: noop })
		}).to.throw('controllerExpression must be a valid string!')

	})

})
