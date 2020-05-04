const { controller, get, post, put, del } = require('../../../../src')

module.exports = controller('/awilix-users')(({ userService }) => {
	const getUsers = (req, res) => {
		res.json(userService.getUsers())
	}

	const postUser = (req, res) => {
		res.json({ message: 'create new user' })
	}

	const putUser = (req, res) => {
		const { id } = req.params
		res.json({ message: `update user with id ${id}` })
	}

	const deleteUser = (req, res) => {
		const { id } = req.params
		res.json({ message: `remove user with id ${id}` })
	}

	return {
		getUsers,
		postUser,
		putUser,
		deleteUser
	}

}, {
	getTasks: get(),
	postTask: post(),
	putTask: put('/:id'),
	deleteTask: del('/:id')
})
