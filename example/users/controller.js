const { 
	get,
	put,
	del,
	post,
	controller 
} = require('../../src/decorators')

class UserController {

	getUsers(ctx) {
		return ctx.response.json({ message: 'get all users' })
	}

	postUser(ctx) {
		const { user } = ctx.response.body
		return ctx.response.json({ message: `create user with name ${user}` })
	}

	putUser(ctx) {
		const { id } = ctx.request.params
		const { user } = ctx.request.body
		return ctx.response.json({ message: `update user with name ${user} with id ${id}` })
	} 

	deleteUser(ctx) {
		const { id } = ctx.request.params
		return ctx.response.json({ message: `delete user with id ${id}` })
	}
}

module.exports = controller('/users')(UserController, {
	getUsers: get(),
	postUser: post(),
	putUser: put('/:id'),
	deleteUser: del('/:id')
})