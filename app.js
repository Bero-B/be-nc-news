const express = require('express')
const app = express()
const {getTopics} = require('./controller/topics-controller')
const {getArticleById, getArticles, patchArticle, addArticle} = require('./controller/articles-controller')
const {addComment, removeComment, patchComment, getCommentsForArticle} = require('./controller/comments-controller')
const getEndpoints = require('./controller/endpoints-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')
const {getUsers, getUserByUsername} = require('./controller/users-controller')

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
app.get("/api/users/:username", getUserByUsername)
app.patch("/api/comments/:comment_id", patchComment)
app.post("/api/articles", addArticle)

app.all("*", invalidEndpoint)
app.use(customErrors)
app.use(psqlErrors)

module.exports = app

