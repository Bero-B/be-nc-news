const db = require('../db/connection')

function insertComment(article_id, reqBody) {
    const {body, username} = reqBody
    const reqKeys = Object.keys(reqBody)
    if (reqKeys.length > 2){
        return Promise.reject({status: 400, msg: "Bad request"})
    }
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
module.exports ={insertComment, deleteComment, updateComment}