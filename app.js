const express = require('express')
const app = express()
const {getTopics} = require('./controller/topics-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')

app.get('/api/topics', getTopics)

app.all("*", invalidEndpoint)


module.exports = app
