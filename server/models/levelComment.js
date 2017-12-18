const LevelComment = require('../lib/mongo').LevelComment

module.exports = {
    create: function create(levelComment) {
        return LevelComment.create(levelComment).exec()
    },
    getLevelCommentByCommentId: function getLevelCommentByCommentId(commentId, page = 1, limit = 20) {
        let start = (page - 1) * limit

        return LevelComment
            .find({commentId})
            .skip(start)
            .limit(limit)
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .exec()
    },
    delLevelCommentByCommentId: function delLevelCommentByCommentId(commentId) {
        return LevelComment.remove({commentId}).exec()
    },
    delById: function delById(author, levelCommentId) {
        return LevelComment.remove({author, _id: levelCommentId}).exec()
    },
    levelCommentCount: function levelCommentCount(commentId) {
        return LevelComment.count({commentId}).exec()
    }
}
