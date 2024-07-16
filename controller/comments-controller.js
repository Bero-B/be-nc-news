const {insertComment, deleteComment} = require('../model/comments-model')

function addComment(req, res, next) {
    const {article_id} = req.params
    insertComment(article_id, req.body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}
function removeComment(req, res, next) {
    const {comment_id} = req.params
    deleteComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

module.exports = {addComment, removeComment}