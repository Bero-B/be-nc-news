const db = require('../db/connection')
const {checkIfArticleExists} = require('../db/seeds/utils')

function selectArticleById(article_id){
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}
function selectArticles() {
    return db.query(`SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`)
    .then(({rows}) => {
        return rows
    })
}
function selectCommentsForArticle(article_id) {
    const commentsForArticle = db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    const promises = [checkIfArticleExists(article_id), commentsForArticle]
    return Promise.all(promises).then(([articleResult, queryResult]) => {
        if (articleResult === false && queryResult.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return queryResult.rows
    })
 }
function updateArticle(article_id, inc_votes) {
    if (!inc_votes){
        return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({rows}) => {
            return rows[0]
        })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`, [inc_votes, article_id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return rows[0]
    })
}
module.exports = {selectArticleById, selectArticles, selectCommentsForArticle, updateArticle}
