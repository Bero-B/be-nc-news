const db = require('../db/connection')

function selectTopics(){
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}
function insertTopic(slug, description){
    return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING*;`, [slug, description])
    .then(({rows}) => {
        return rows[0]
    })
}
module.exports = {selectTopics, insertTopic} 