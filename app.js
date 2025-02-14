const express = require('express')
const cors = require('cors')
const app = express()
const {getTopics, addTopic} = require('./controller/topics-controller')
const {getArticleById, getArticles, patchArticle, addArticle, removeArticle} = require('./controller/articles-controller')
const {addComment, removeComment, patchComment, getCommentsForArticle} = require('./controller/comments-controller')
const getEndpoints = require('./controller/endpoints-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')
const {getUsers, getUserByUsername} = require('./controller/users-controller')

app.use(cors());
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsForArticle)
app.get('/api/users', getUsers)
app.get("/api/users/:username", getUserByUsername)
app.post('/api/articles/:article_id/comments', addComment)
app.post("/api/articles", addArticle)
app.post("/api/topics", addTopic)
app.patch('/api/articles/:article_id', patchArticle)
app.delete('/api/comments/:comment_id', removeComment)
app.patch("/api/comments/:comment_id", patchComment)
app.delete("/api/articles/:article_id", removeArticle)

app.all("*", invalidEndpoint)
app.use(customErrors)
app.use(psqlErrors)

module.exports = app

