const {
	get,
	put,
	del,
	post,
	controller
} = require('../../../src/decorators')

const getTask = ctx => ctx.response.json({ 'message': 'get tasks' })

const postTask = ctx => {
	const { name } = ctx.request.body
	return ctx.response.json({ 'message': `create task with name ${name}` })
}

const putTask = ctx => {
	const { id } = ctx.request.params
	const { name } = ctx.request.body

	return ctx.response.json({ 'message': `update task to name ${name} with id ${id}` })
}

const deleteTask = ctx => {
	const { id } = ctx.request.params
	return ctx.response.json({ 'message': `delete task with id ${id}` })
}

module.exports = controller('/tasks')({
	getTask,
	putTask,
	postTask,
	deleteTask
}, {
	getTask: get(),
	postTask: post(),
	putTask: put('/:id'),
	deleteTask: del('/:id')
})
