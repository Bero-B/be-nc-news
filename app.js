const express = require('express')
const app = express()
const {getTopics} = require('./controller/topics-controller')
const {getArticleById, getArticles, getCommentsForArticle} = require('./controller/articles-controller')
const getEndpoints = require('./controller/endpoints-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')


app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsForArticle)

app.all("*", invalidEndpoint)
app.use(customErrors)
app.use(psqlErrors)



module.exports = app

