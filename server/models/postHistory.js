const PostHistory = require('../lib/mongo').PostHistory
const CommentModel = require('./comment')

PostHistory.plugin('addCommentCount', {
    afterFind(historys) {
        return Promise.all(historys.map((history) => {
            return CommentModel.commentCount(history.postId._id)
                .then((commentCount) => {
                    history.postId.commentCount = commentCount
                    return history
                })
        }))
    }
})

module.exports = {
    create: function create(history) {
        return PostHistory.create(history).exec()
    },
    getHistoryByAuthor: function getHistoryByAuthor(author, page = 1, limit = 20) {
        let start = (page - 1) * 20

        return PostHistory.find({author})
            .skip(start)
            .limit(limit)
            .populate({path: 'postId', model: 'Post'})
            .populate({path: 'postId.author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .addCommentCount()
            .exec()
    },
    delOneHistory: function delOneHistory(history) {
        return PostHistory.remove(history).exec()
    },
    delHistoryByPostId: function delHistoryByPostId(postId) {
        return PostHistory.remove({postId}).exec()
    },
    delHistoryByAuthor: function delHistoryByAuthor(author) {
        return PostHistory.remove({author}).exec()
    }
}
