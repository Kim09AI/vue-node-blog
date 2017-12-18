const CategoryFollow = require('../lib/mongo').CategoryFollow

module.exports = {
    create: function create(categoryFollow) {
        return CategoryFollow.create(categoryFollow).exec()
    },
    getAuthorCategoryFollow: function getAuthorCategoryFollow(author) {
        return CategoryFollow.find({author}).exec()
    },
    delCategoryFollow: function delCategoryFollow(categoryFollow) {
        return CategoryFollow.remove(categoryFollow).exec()
    }
}
