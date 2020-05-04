module.exports = ({ usersDb }) => {
	const getUsers = () => {
		return usersDb
	}

	return { getUsers }
}
