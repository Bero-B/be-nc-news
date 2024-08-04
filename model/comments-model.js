const db = require('../db/connection')
const {checkIfArticleExists} = require('../db/seeds/utils')

function insertComment(article_id, reqBody) {
    const {body, username} = reqBody
    return db.query(`INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING*;`, [article_id, body, username])
    .then(({rows}) => {
        return rows[0].body
    })
}
function deleteComment(comment_id) {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
    })
}
function updateComment(comment_id, inc_votes) { 
    if (!inc_votes) {
        return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({rows}) => {
            return rows[0]
        })
    }
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`, [inc_votes, comment_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}
function selectCommentsForArticle(article_id, limit = 10, p) {
    let queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    if (isNaN(limit)){
        return Promise.reject({status: 400, msg: "Invalid query - limit and p can only be numbers"})
    } else {
        queryString += ` LIMIT ${limit}`
    }
    if (p){
        if(isNaN(p)){
            return Promise.reject({status: 400, msg: "Invalid query - limit and p can only be numbers"})
        } else {
            queryString += ` OFFSET ${limit * (p-1)};`
        }
    }
    const commentsForArticle = db.query(queryString, [article_id])
    const promises = [checkIfArticleExists(article_id), commentsForArticle]
    return Promise.all(promises).then(([articleResult, queryResult]) => {
        if (articleResult === false && queryResult.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return queryResult.rows
    })
 }
module.exports = {insertComment, deleteComment, updateComment, selectCommentsForArticle}