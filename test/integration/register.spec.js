/* eslint-disable no-undef */
const express = require('express')
const request = require('supertest')
const database = require('./awilix/database')
const tasksService = require('./awilix/services/tasks')
const usersService = require('./awilix/services/users')
const { useControllers, useAwilixControllers, awilix, scopePerRequest } = require('../../src')

describe('express routing decorators - integration', () => {

	describe('useAwilixControllers registration integration tests', () => {
		let app,
			server,
			container

		before(done => {
			app = express()
			let router = express.Router()

			container = awilix.createContainer()
			container.register({
				userService: awilix.asFunction(usersService).scoped(),
				taskService: awilix.asFunction(tasksService).scoped(),
				usersDb: awilix.asValue(database.usersDb),
				tasksDb: awilix.asValue(database.tasksDb)
			})

			app.use(scopePerRequest(container))
			app.use(useAwilixControllers({
				router,
				controllerExpression: `${__dirname}/awilix/controllers/*.js`
			}))

			server = app.listen(done)
		})

		it('should execute a /GET request in awilix-tasks controller', done => {
			request(app)
				.get('/awilix-tasks')
				.expect(200, {
					task: 'create integration tests',
					done: true
				}, done)
		})

		it('should execute a /POST request in awilix-tasks controller', done => {
			request(app)
				.post('/awilix-tasks')
				.expect(200, {
					message: 'create new task'
				}, done)
		})

		it('should execute a /PUT request in awilix-tasks controller', done => {
			request(app)
				.put('/awilix-tasks/10')
				.expect(200, {
					message: 'update task with id 10'
				}, done)
		})

		it('should execute a /DELETE request in awilix-tasks controller', done => {
			request(app)
				.delete('/awilix-tasks/10')
				.expect(200, {
					message: 'remove task with id 10'
				}, done)
		})

		after(done => server.close(done))
	})

	describe('useControllers registration integration tests', () => {
		let app,
			server

		before(done => {
			app = express()
			let router = express.Router()

			app.use(express.json())
			app.use(useControllers({
				router,
				controllerExpression: `${__dirname}/**/controller.js`
			}))

			server = app.listen(done)
		})

		after(done => {
			server.close(done)
		})

		it('should execute a /GET request in tasks controller', done => {
			request(app)
				.get('/tasks')
				.expect(200, {
					message: 'get tasks'
				}, done)
		})

		it('should execute a /POST request in tasks controller', done => {
			request(app)
				.post('/tasks')
				.expect(200, {
					message: 'create task'
				}, done)
		})

		it('should execute a /PUT request in tasks controller', done => {
			request(app)
				.put('/tasks')
				.expect(200, {
					message: 'update task'
				}, done)
		})

		it('should execute a /DELETE request in tasks controller', done => {
			request(app)
				.delete('/tasks')
				.expect(200, {
					message: 'delete task'
				}, done)
		})
	})
})
