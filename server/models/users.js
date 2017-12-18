const User = require('../lib/mongo').User

module.exports = {
    create: function create(user) {
        return User.create(user).exec()
    },
    getUserByName: function getUserByName(name) {
        return User.findOne({name}).addCreatedAt().exec()
    },
    getUserByOtherUserId: function getUserByOtherUserId(otherUserId) {
        return User.findOne({otherUserId}).addCreatedAt().exec()
    }
}
