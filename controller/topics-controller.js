const {selectTopics, selectArticleById} = require('../model/topics-model')
const endpoints =  require('../endpoints.json')

function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}
function getEndpoints(req, res, next) {
    res.status(200).send({endpoints})
}
function getArticleById (req, res, next){
    const {article_id} = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
module.exports = {getTopics, getEndpoints, getArticleById}