const {selectUsers, selectUserByUsername} = require('../model/users-model')

function getUsers(req, res, next) {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}
function getUserByUsername(req, res, next) {
    const {username} = req.params
    selectUserByUsername(username).then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}
module.exports = {getUsers, getUserByUsername}