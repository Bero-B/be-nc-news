const db = require('../db/connection')

function insertComment(article_id, body, username) {
    return db.query(`INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING*;`, [article_id, body, username])
    .then(({rows}) => {
        return rows[0].body
    })
}

module.exports = insertComment