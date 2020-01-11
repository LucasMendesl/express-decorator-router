/* eslint-disable indent */
const {
	get,
	put,
	del,
	post,
	controller
} = require('../../../../src/decorators')

class TasksController {

	getTasks(ctx) {
		ctx.response.json({ message: 'get tasks' })
  }

  createTask(ctx) {
		ctx.response.json({ message: 'create task' })
  }

  updateTask(ctx) {
		ctx.response.json({ message: 'update task' })
  }

  deleteTask(ctx) {
		ctx.response.json({ message: 'delete task' })
  }
}

module.exports = controller('/tasks')(TasksController, {
  getTasks: get(),
  createTask: post(),
  updateTask: put(),
  deleteTask: del()
})
