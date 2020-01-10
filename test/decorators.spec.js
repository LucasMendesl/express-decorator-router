/* eslint-disable no-undef */
const chai = require('chai')
const decorators = require('../src/decorators')

const { expect } = chai
chai.config.includeStack = true

const noop = () => {}
const noopMl = () => {}
const noopMl2 = () => {}

describe('express routing decorators', () => {
	describe('controller and http methods decorators', () => {
		class MyController { myMethod () { } }

		it('should throw if controller receive non-string path', () => {
			expect(() => {
				decorators.controller(1)(class Ctrl {}, {})
			}).to.throw('controllerPath is not a valid string')
		})

		it('should throw if action decorator receive non-string path', () => {
			expect(() => {
				decorators.controller()(MyController, {
					myMethod: decorators.get(1)
				})
			}).to.throw('The first argument is not a valid string path or middleware function')
		})

		it('should add route metadata in controller object', () => {
			const Controller = decorators.controller()(class Ctrl {}, {})

			const instance = new Controller()
			expect(instance).has.property('$routes')
		})

		it('should concat rootPath when action has a child path', () => {
			const Controller = decorators.controller('/test-controller')(
				MyController, {
					myMethod: decorators.get('/:id')
				}
			)

			const instance = new Controller()
			expect(instance).to.have.property('$routes').with.lengthOf(1)
			expect(instance.$routes).to.eql([{
				httpMethod: 'get',
				endpointFn: 'myMethod',
				actionPath: '/test-controller/:id',
				actionMiddlewares: []
			}])
		})

		it('should throws error when action decorator middleware receive non-function parameter', () => {
			expect(() => {
				decorators.controller('/rootPath')({
					myGetFn: noop
				}, { myGetFn: decorators.post('/another', 1) })
			}).to.throw('invalid type, middleware must be a function')
		})

		it('should normalize delete method', () => {
			const Controller = decorators.controller('/my-controller')(
				MyController, {
					myMethod: decorators.del()
				}
			)

			const instance = new Controller()
			expect(instance).to.have.property('$routes').with.lengthOf(1)
			expect(instance.$routes).to.eql([{
				httpMethod: 'delete',
				endpointFn: 'myMethod',
				actionPath: '/my-controller',
				actionMiddlewares: []
			}])
		})

		it('should pass middleware function to controller decorator', () => {
			const controller = decorators.controller('/literal-controller', noop)({
				endpoint () {},
				anotherEndpoint () {}
			}, {
				endpoint: decorators.put('/:id'),
				anotherEndpoint: decorators.post('/post')
			})

			expect(controller).to.have.property('$routes').with.lengthOf(2)
			expect(controller.$routes).to.eql([{
				httpMethod: 'put',
				endpointFn: 'endpoint',
				actionPath: '/literal-controller/:id',
				actionMiddlewares: [noop]
			}, {
				httpMethod: 'post',
				endpointFn: 'anotherEndpoint',
				actionPath: '/literal-controller/post',
				actionMiddlewares: [noop]
			}])
		})

		it('should throws error when route decorator receive a invalid express router method', () => {
			expect(() => {
				decorators.controller()(MyController, {
					myMethod: decorators.route('test')
				})
			}).to.throw('method must be a valid express routing function')
		})

		it('should add metadata when controller have an action get', () => {
			const Controller = decorators.controller('/my-controller')(MyController, {
				myMethod: decorators.get()
			})

			const instance = new Controller()
			expect(instance).to.have.property('$routes').with.lengthOf(1)
			expect(instance.$routes).to.eql([{
				httpMethod: 'get',
				endpointFn: 'myMethod',
				actionPath: '/my-controller',
				actionMiddlewares: []
			}])
		})

		it('should concat action middlewares with controller middlewares', () => {
			const controller = decorators.controller('/my-controller', noop)({
				endpoint () { }
			}, {
				endpoint: decorators.post(noopMl, noopMl2)
			})

			expect(controller).to.have.property('$routes').with.lengthOf(1)
			expect(controller.$routes).to.eql([{
				httpMethod: 'post',
				endpointFn: 'endpoint',
				actionPath: '/my-controller',
				actionMiddlewares: [noop, noopMl, noopMl2]
			}])
		})

		it('should throws error when try to pass unexpected property to decorator handler', () => {
			expect(() => {
				decorators.controller('/test')({}, {
					anotherEndpoint: decorators.get()
				})
			}).to.throw('a property anotherEndpoint doesn\'t exists in target object')
		})

		it('should throws error when decorate a method without pass a path in controller and http method', () => {
			expect(() => {
				decorators.controller()({ endpoint(){} }, {
					endpoint: decorators.get()
				})
			}).to.throws('actionPath cannot be empty')
		})

		it('should add metadata when controller have an action post', () => {
			const controller = decorators.controller('/my-new-controller')({
				myNewFunction () { }
			}, {
				myNewFunction: decorators.post()
			})

			expect(controller).to.have.property('$routes').with.lengthOf(1)
			expect(controller.$routes).to.eql([{
				httpMethod: 'post',
				endpointFn: 'myNewFunction',
				actionPath: '/my-new-controller',
				actionMiddlewares: []
			}])
		})
	})
})
