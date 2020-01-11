/* eslint-disable no-undef */
const express            = require('express')
const request            = require('supertest')
const { useControllers } = require('../../src')

describe('express routing decorators - integration', () => {
	let app,
		server

	beforeEach(done => {
		app = express()
		let router = express.Router()

		app.use(express.json())
		app.use(useControllers({
			router,
			controllerExpression: `${__dirname}/**/controller.js`
		}))

		server = app.listen(done)
	})

	afterEach(done => {
		server.close(done)
	})

	it ('should execute a /GET request in tasks controller',  done => {
		request(app)
			.get('/tasks')
			.expect(200, {
				message: 'get tasks'
			}, done)
	})

	it ('should execute a /POST request in tasks controller',  done => {
		request(app)
			.post('/tasks')
			.expect(200, {
				message: 'create task'
			}, done)
	})

	it ('should execute a /PUT request in tasks controller',  done => {
		request(app)
			.put('/tasks')
			.expect(200, {
				message: 'update task'
			}, done)
	})

	it ('should execute a /DELETE request in tasks controller',  done => {
		request(app)
			.delete('/tasks')
			.expect(200, {
				message: 'delete task'
			}, done)
	})
})
