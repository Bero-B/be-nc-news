const {selectArticleById, selectArticles, selectCommentsForArticle, updateArticle} = require('../model/articles-model')

function getArticleById (req, res, next){
    const {article_id} = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
function getArticles(req, res, next) {
    const {sort_by, order, topic} = req.query
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}
function getCommentsForArticle(req, res, next) {
    const {article_id} = req.params
    selectCommentsForArticle(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}
function patchArticle(req, res, next) {

    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
module.exports = {getArticleById, getArticles, getCommentsForArticle, patchArticle}