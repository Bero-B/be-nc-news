const {selectArticleById, selectArticles, selectCommentsForArticle} = require('../model/articles-model')

function getArticleById (req, res, next){
    const {article_id} = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
function getArticles(req, res, next) {
    selectArticles().then((articles) => {
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

module.exports = {getArticleById, getArticles, getCommentsForArticle}