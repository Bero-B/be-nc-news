const express = require('express')
const app = express()
const {getTopics} = require('./controller/topics-controller')
const {customErrors, psqlErrors, invalidEndpoint} = require('./error-handling')
const endpoints =  require('./endpoints.json')

app.get('/api/topics', getTopics)
app.get('/api', (req, res, next) => {
    res.status(200).send({endpoints})
})

app.all("*", invalidEndpoint)


module.exports = app
