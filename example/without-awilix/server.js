const express = require('express')
const { useControllers } = require('../../src')

const app = express()
const router = express.Router()

app.use(express.json())

app.use('/api', useControllers({
	controllerExpression: `${__dirname}/**/controller.js`,
	router
}))

app.listen(3000, () => console.log('magic happens on port 3000'))
