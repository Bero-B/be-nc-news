const express = require('express')
const app = express()
const {getTopics} = require('./controller/topics-controller')
const {getArticleById, getArticles, getCommentsForArticle, patchArticle} = require('./controller/articles-controller')
const {addComment, removeComment} = require('./controller/comments-controller')
const getEndpoints = require('./controller/endpoints-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')
const {getUsers} = require('./controller/users-controller')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsForArticle)
app.post('/api/articles/:article_id/comments', addComment)
app.patch('/api/articles/:article_id', patchArticle)
app.delete('/api/comments/:comment_id', removeComment)
app.get('/api/users', getUsers)

app.all("*", invalidEndpoint)
app.use(customErrors)
app.use(psqlErrors)



module.exports = app

