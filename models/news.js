'use strict'

class NewsModel {
    constructor(imageUrl, date, title, description, publisherLogo,
        publisherName, newsUrl) {
        this.imageUrl = imageUrl
        this.date = date
        this.title = title
        this.description = description
        this.publisherLogo = publisherLogo
        this.publisherName = publisherName
        this.newsUrl = newsUrl
    }
}

module.exports = class News {

    static async getNews() {
        try {
            const reqUrl = `https://api.goapi.io/stock/idx/news`
            const value = await axios.get(reqUrl, {
                headers: {
                    'accept': 'application/json',
                    'X-API-KEY': process.env.apiKey_dev_news,
                },
                params: {
                    page: 1,
                    symbol: 'BBCA',
                },
            })

            const returnedArr = value.data.data.results
            const newsData = returnedArr.map((el) => {
                return new NewsModel(el.image, el.published_at, el.title,
                    el.description, el.publisher.logo, el.publisher.name,
                    el.url
                )
            })

            return newsData

        } catch (error) {
            console.log(error);
            return [{
                imageUrl: '',
                date: '',
                title: 'NOT FOUND',
                description: `ERROR MESSAGE: ${error.message}`,
                publisherLogo: '',
                publisherName: '',
                newsUrl: ''
            }]
        }
    }
}