const db = require('../db/connection')
const {checkIfTopicExists} = require('../db/seeds/utils')

function selectArticleById(article_id){
    return db.query(`SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}
function selectArticles(sort_by = 'created_at', order = 'desc', topic, limit = 10, p) {
    const validSortBys = ["created_at", "article_id", "title", "topic", "author", "comment_count", "votes", "article_img_url"]
    const validOrder = ["asc", "desc"]
    const queryValues = []
    let queryString = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`
    if (topic){
        if(!isNaN(topic)){
            return Promise.reject({status:400, msg: "Invalid query"})
        } else {
            queryString += ` WHERE topic = $1`
            queryValues.push(topic)
        }
    }
    
    if(!validSortBys.includes(sort_by)){
        return Promise.reject({status: 400, msg: "Invalid query"})
    }
    if(!validOrder.includes(order)){
        return Promise.reject({status: 400, msg: "Invalid query"})
    }
    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
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
    const allArticles = db.query(queryString, queryValues)
    const promises = [allArticles, checkIfTopicExists(topic)]
    return Promise.all(promises)
    .then(([queryResult, topicResult]) => {
        if (queryResult.rows.length === 0 & topicResult === false){
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
function insertArticle(author, title, body, topic, article_img_url) {
    if (!article_img_url){
        return db.query(`INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING*;`, [author, title, body, topic])
        .then(({rows}) => {
            const {article_id} = rows[0]
            return db.query(`SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
            .then(({rows}) => {
                return rows[0]
            })
        }) 
    }
    return db.query(`INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING*;`, [author, title, body, topic, article_img_url])
    .then(({rows}) => {
        const {article_id} = rows[0]
        return db.query(`SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
        .then(({rows}) => {
            return rows[0]
        })
    })
}
function deleteArticle(article_id){
    return db.query(`DELETE FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
    })
}
module.exports = {selectArticleById, selectArticles, updateArticle, insertArticle, deleteArticle}
