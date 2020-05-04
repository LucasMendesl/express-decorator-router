const {get, controller } = require('../../../src')

function tasksController({ taskService }) {

	const getTasks = (_, res) => {
		res.json(taskService.getTasks())
	}

	return {
		getTasks
	}
}

module.exports = controller('/tasks')(tasksController, {
	getTasks: get()
})
