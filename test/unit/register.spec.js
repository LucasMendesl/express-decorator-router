/* eslint-disable no-undef */
const { expect } = require('chai')
const useControllers = require('../../src/register')

const noop = () => {}

describe('express routing decorators - register', () => {

	it ('should throws error when pass invalid router parameter', () => {
		expect(() => {
			useControllers()
		}).to.throw('router must be a function or an object!')
	})

	it ('should throws error when pass invalid expression to find controllers', () => {
		expect(() => {
			useControllers({ router: noop })
		}).to.throw('controllerExpression must be a valid string!')
	})
})
