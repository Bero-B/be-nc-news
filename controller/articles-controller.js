const {selectArticleById, selectArticles, updateArticle, insertArticle} = require('../model/articles-model')

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
function patchArticle(req, res, next) {

    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
function addArticle(req, res, next) {
    const {author, title, body, topic, article_img_url} = req.body
    insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
        res.status(201).send({article})
    })
    .catch(next)
}

module.exports = {getArticleById, getArticles, patchArticle, addArticle}