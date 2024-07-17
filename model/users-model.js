const db = require('../db/connection')

function selectUsers() {
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {selectUsers}