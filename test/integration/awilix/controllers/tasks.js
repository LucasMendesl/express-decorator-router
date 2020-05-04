const { controller, get, post, put, del, inject } = require('../../../../src')

const getTasks = (req, res) => {
	const { taskService } = req
	res.json(taskService.getTasks())
}

const postTask = (req, res) => {
	res.json({ message: 'create new task' })
}

const putTask = (req, res) => {
	const { id } = req.params
	res.json({ message: `update task with id ${id}` })
}

const deleteTask = (req, res) => {
	const { id } = req.params
	res.json({ message: `remove task with id ${id}` })
}

module.exports = controller('/awilix-tasks', inject('taskService'))({
	getTasks,
	postTask,
	putTask,
	deleteTask
}, {
	getTasks: get(),
	postTask: post(),
	putTask: put('/:id'),
	deleteTask: del('/:id')
})
