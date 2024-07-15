const express = require('express')
const app = express()
const {getTopics, getEndpoints, getArticleById} = require('./controller/topics-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')


app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)

app.all("*", invalidEndpoint)
app.use(customErrors)
app.use(psqlErrors)



module.exports = app
