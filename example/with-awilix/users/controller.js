const {get, controller, inject } = require('../../../src')

const getUsers = (req, res) => {
	const { userService } = req
	return res.json(userService.getUsers())
}

module.exports = controller('/users', inject('userService'))({
	getUsers
}, {
	getUsers: get()
})
