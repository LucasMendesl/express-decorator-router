/* eslint-disable no-undef */
const chai = require('chai')
const sinon = require('sinon')
const resolvers = require('../../src/resolvers')

chai.config.includeStack = true

describe('express routing decorators - resolvers', () => {
	let req

	beforeEach(() => {
		req = {
			container: {
				build: sinon.stub()
			}
		}
	})

	describe('create resolver tests', () => {

		it('should be resolve a literal object controller', () => {
			const controller = {
				getTasks: sinon.spy()
			}

			req.container.build.returns(controller)
			const resolveFn = resolvers.createResolver(controller)('getTasks')
			resolveFn(req)

			sinon.assert.calledWith(controller.getTasks, req)
		})

		it('should be resolve a class controller', () => {
			class Controller {
				constructor() {
					this.method = sinon.spy()
				}
			}

			const controller = new Controller()

			req.container.build.returns(controller)

			const resolveFn = resolvers.createResolver(Controller)('method')
			resolveFn(req)

			sinon.assert.calledWith(controller.method, req)
		})

		it('should be resolve a factory function controller', () => {
			const factory = function() {
				const factoryFn = sinon.spy()

				return {
					factoryFn
				}
			}

			const resolverResult = factory()
			req.container.build.returns(resolverResult)

			const resolveFn = resolvers.createResolver(factory)('factoryFn')
			resolveFn(req)

			sinon.assert.calledWith(resolverResult.factoryFn, req)
		})
	})
})
