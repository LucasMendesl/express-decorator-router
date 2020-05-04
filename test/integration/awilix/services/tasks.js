module.exports = ({ tasksDb }) => {
	const getTasks = () => {
		return tasksDb
	}

	return { getTasks }
}
