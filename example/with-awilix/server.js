const express = require('express')
const taskService = require('./tasks/service')
const userService = require('./users/service')
const newsService = require('./news/service')
const { useAwilixControllers, awilix, scopePerRequest } = require('../../src')

const app = express()
const router = express.Router()
const container = awilix.createContainer()

container.register({
	taskService: awilix.asValue(taskService).scoped(),
	userService: awilix.asValue(userService).scoped(),
	newsService: awilix.asValue(newsService).scoped()
})

app.use(express.json())
app.use(scopePerRequest(container))

app.use('/api/awilix', useAwilixControllers({
	controllerExpression: `${__dirname}/**/controller.js`,
	router
}))

app.listen(3200, () => console.log('magic happens on port 3200'))
