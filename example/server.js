const util      = require('util')
const express   = require('express')

const app       = express()
const router    = express.Router()
const glob      = util.promisify(require('glob'))

app.use(express.json())

const loadFiles = files => files.map(file => require(file))
const registerControllers = controllers => {
	controllers.forEach(Controller => {
		const controller = Controller.prototype ? new Controller() : Controller
		controller.$routes.forEach(({
			httpMethod,
			endpointFn,
			actionPath,
			actionMiddlewares
		}) => router[httpMethod](actionPath, ...actionMiddlewares, (request, response, next) => {
			controller[endpointFn]({ request, response, next })
		}))
	})
}

glob(`${__dirname}/**/controller.js`)
	.then(loadFiles)
	.then(registerControllers)
	.then(() => app.use('/api', router))
	.then(() => app.listen(3000))
	.then(() => console.log('app listen on port 3000'))

