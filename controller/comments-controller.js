const insertComment = require('../model/comments-model')

function addComment(req, res, next) {
    const {article_id} = req.params
    const {username, body} = req.body
    insertComment(article_id, body, username).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

module.exports = addComment