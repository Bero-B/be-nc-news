const {selectTopics, insertTopic} = require('../model/topics-model')


function getTopics(req, res, next) {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}
function addTopic(req, res, next){
    const {slug, description} = req.body
    insertTopic(slug, description)
    .then((topic) => {
        res.status(201).send({topic})
    })
    .catch(next)
}

module.exports = {getTopics, addTopic}