const Comment = require('../lib/mongo').Comment
const LevelCommentModel = require('./levelComment')
const CommentLikeModel = require('./commentLike')

// 添加二级评论数
Comment.plugin('addLevelCommentCount', {
    afterFind(comments) {
        return Promise.all(comments.map((comment) => {
            return LevelCommentModel.levelCommentCount(comment._id)
                .then((levelCommentCount) => {
                    comment.levelCommentCount = levelCommentCount
                    return comment
                })
        }))
    },
    afterFindOne(comment) {
        if (comment) {
            return LevelCommentModel.levelCommentCount(comment._id)
                .then((levelCommentCount) => {
                    comment.levelCommentCount = levelCommentCount
                    return comment
                })
        }
        return comment
    }
})

// 添加评论的喜欢人数
Comment.plugin('addCommentLikeCount', {
    afterFind(comments) {
        return Promise.all(comments.map((comment) => {
            return CommentLikeModel.commentLikeCount(comment._id)
                .then((commentLikeCount) => {
                    comment.commentLikeCount = commentLikeCount
                    return comment
                })
        }))
    },
    afterFindOne(comment) {
        if (comment) {
            return CommentLikeModel.commentLikeCount(comment._id)
                .then((commentLikeCount) => {
                    comment.commentLikeCount = commentLikeCount
                    return comment
                })
        }
        return comment
    }
})

module.exports = {
    create: function create(comment) {
        return Comment.create(comment).exec()
    },
    getCommentByPostId: function getCommentByPostId(postId, page = 1, limit = 20) {
        let start = (page - 1) * 20

        return Comment
            .find({postId})
            .skip(start)
            .limit(limit)
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .addLevelCommentCount()
            .addCommentLikeCount()
            .exec()
    },
    getCommentById: function getCommentById(commentId) {
        return Comment
            .findOne({_id: commentId})
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .addLevelCommentCount()
            .addCommentLikeCount()
            .exec()
    },
    delCommentById: function delCommentById(author, commentId) {
        let query = {_id: commentId}
        author && (query.author = author)

        return Comment
            .remove(query)
            .exec()
            .then((res) => {
                if (res.result.ok && res.result.n > 0) {
                    return Promise.all([
                        LevelCommentModel.delLevelCommentByCommentId(commentId),
                        CommentLikeModel.delCommentLikeByCommentId(commentId)
                    ])
                }
            })
    },
    delCommentByPostId: function delCommentByPostId(postId) {
        return Comment
            .remove({postId})
            .exec()
    },
    commentCount: function count(postId) {
        return Comment.count({postId}).exec()
    }
}
