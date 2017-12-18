const FollowAuthor = require('../lib/mongo').FollowAuthor
const PostModel = require('./post')

// 添加关注的用户发表的文章总数
FollowAuthor.plugin('addFollowAuthorPostCount', {
    afterFind(follows) {
        return Promise.all(follows.map((follow) => {
            return PostModel.postCountByAuthor(follow.followAuthor._id).then((postCount) => {
                follow.followAuthor.postCount = postCount
                return follow
            })
        }))
    }
})

module.exports = {
    create: function create(followData) {
        return FollowAuthor.create(followData).exec()
    },
    getFollowAuthorByAuthor: function getFollowAuthorByAuthor(author) {
        return FollowAuthor.find({author})
            .populate({path: 'followAuthor', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .addFollowAuthorPostCount()
            .exec()
    },
    getFollowAuthor: function getFollowAuthor(followAuthor, author) {
        return FollowAuthor.findOne({followAuthor, author}).exec()
    },
    delFollowAuthor: function delFollowAuthor(followData) {
        return FollowAuthor.remove(followData).exec()
    }
}
