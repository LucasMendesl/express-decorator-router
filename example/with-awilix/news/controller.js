const { controller, get } = require('../../../src')

class NewsController {

	constructor({ newsService }) {
		this.newsService = newsService
	}

	getNews(_, res) {
		res.json(this.newsService.getNews())
	}
}

module.exports = controller('/news')(NewsController, {
	getNews: get()
})
