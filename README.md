# express-decorator-router

[![NPM](https://nodei.co/npm/express-decorator-router.png?compact=true)](https://www.npmjs.com/package/express-decorator-router)

> use decorators in a simple way without transpiling javascript code

## Why?

Have you ever considered using the decorators feature using vanilla javascript to automate the creation of express routes?

The [express-decorator-router](https://github.com/LucasMendesl/express-decorator-router) package came to solve this problem in a simple and didactic way, without the need for transpiling processes in your code.

This package is intended to avoid unnecessary creation of two files where one file contains the route definition and the other file has the function that handles the route request / response process, leaving simpler maintenance and more scalable code.

## Usage
You can use [Awilix](https://github.com/jeffijoe/awilix) to effort and facilitate your Dependency Injection.

Let's take a short example using the decorators on a prototype-based controller.

**Without Awilix**

```js
const {
  get,
  controller
} = require ('express-decorator-router')

const controllerFactoryDecorator = controller('/users')

class UsersController {
  constructor () {/*...class constructor definition*/}
        
  getUsers (ctx) {/*...process to get users (database, network, etc)*/}
       
  getUsersById (ctx) {/*...implementation of another endpoint*/}
}

module.exports = controllerFactoryDecorator(UsersController, {
  getUsers: get (),
  getUsersById: get ('/:id')
})
```

**With Awilix**
```js 
const { get, controller, inject } = require('express-decorator-router')

const getUsers = (req, res) => {
	const { userService } = req
	return res.json(userService.getUsers())
}

module.exports = controller('/users', inject('userService'))({
	getUsers
}, {
	getUsers: get()
})

```

the controller function returns a high order function where the decorator definition is made by associating a decorator with a class method as seen in the example above.

Let's take another example, but let's use middleware and a literal object to define a controller:

```js
const {
  get,
  post,
  controller
} = require ('express-decorator-router')

const authExampleMiddleware = (req, res, next) => {
  if (!req.user) return next(new Error('invalid user'))      
  return next ()
}

const controllerFactoryDecorator = controller('/tasks', authExampleMiddleware)

const getTasks = ctx => {/*...*/}
const createTask = ctx => {/*...*/}

module.exports = controllerFactoryDecorator({
  getTasks,
  createTask
}, {
  getTasks: get(),
  createTask: post()
})
```

In the example above, we create middleware to authenticate users and associate it with the controller function, so middleware logic will be applied to all controller methods. The same technique can be used at the method level.

**Example:**

```js
// only getTasks method requires authentication for access
module.exports = controller ('/tasks') ({getTasks, createTask}, {
  getTasks: get (authExampleMiddleware),
  createTask: post ()
})
```
When we define a controller, we can pass two arguments to function, the first being the base path of the controller and the second an array containing middleware (the same arguments are accepted by route decorators). If the controller function does not receive any arguments, the path is defined by the value received by the method decorator. Let's look at an example:

```js

const middlewareTest = (req, res, next) => { /*any middleware implementation*/ }
const anotherMiddlewareTest = (req, res, next) => { /*any middleware implementation*/ }

module.exports = controller () ({
  getTasks,
  createTask
}, {
  getTasks: get ('/tasks', middlewareTest), // after the path, it is possible to pass an array of middleware
  createTask: post ('/tasks', anotherMiddlewareTest)
})
```
Once the decorators are applied, every controller instance (being prototype or literal object based) will receive an array of routes, where the metadata of each route is defined, making it possible to dynamically assemble the routes.

## Register Controllers

Before putting the application to run, it is necessary to re-bind the controller methods to the routes using the metadata produced by the decorators. The [express-decorator-router](https://github.com/LucasMendesl/express-decorator-router) package has a feature that will automatically register express routes. Let's look at an example:

**Withour Awilix**
```js

const express             = require('express')
const cors                = require('cors')
const { useControllers }  = require('express-decorator-router')

const app             = express()
const router          = express.Router()

app.use(cors())
app.use(express.json())

app.use('/api', useControllers({
   router,
   controllerExpression: `${__dirname}/**/controller.js`
}))

//or if you use middleware without route prefix
app.use(useControllers({
   router,
   controllerExpression: `${__dirname}/**/controller.js`
}))

```

**With Awilix** 
```js 
const express = require('express')
const taskService = require('./tasks/service')
const userService = require('./users/service')
const newsService = require('./news/service')
const {
  useAwilixControllers, 
  awilix, 
  scopePerRequest 
} = require('express-decorator-router')

const app = express()
const router = express.Router()
const container = awilix.createContainer()

//registry your services
container.register({
	taskService: awilix.asValue(taskService).scoped(),
	userService: awilix.asValue(userService).scoped(),
	newsService: awilix.asValue(newsService).scoped()
})

app.use(express.json())
app.use(scopePerRequest(container))

app.use('/api/awilix', useAwilixControllers({
	router,
	controllerExpression: `${__dirname}/**/controller.js`
}))
```
The **useControllers** and **useAwilixControllers** methods uses two parameters, the first is the routing mechanism and the second is a [glob](https://github.com/isaacs/node-glob) expression that has the responsibility of finding all controllers that match the pattern of the expression, the only difference between **useControllers** and **useAwilixControllers** is that the awilix require to use a container registration for your dependency injections.
### Example

You can see a demo in the [example](https://github.com/LucasMendesl/express-decorator-router/tree/master/example) folder.


### Decorators API

* `register ({ routes: Function, controllerExpression: string  }): Function`
* `controller (path: string, ...middlewares?:Function []): Function`
* `route (method: string, methodPath: string, ...middlewares?:Function []): Function`
* `head`, `options`, `get`, `post`, `put`, `patch`, `del`, `delete`, `all`: partial functions provided by the `route` method that automatically supply the `httpMethod` argument.


## Run Tests

```bash
  npm install
  npm test
```

## Contributing

Contributions via pull requests are welcome :-).

## License

MIT © [Lucas Mendes Loureiro](http://github.com/lucasmendesl)

