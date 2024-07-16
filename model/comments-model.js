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
module.exports ={insertComment, deleteComment}