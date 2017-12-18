const CommentLike = require('../lib/mongo').CommentLike

module.exports = {
    create: function create(commentLike) {
        return CommentLike.create(commentLike).exec()
    },
    commentLikeCount: function commentLikeCount(commentId) {
        return CommentLike.count({commentId}).exec()
    },
    getCommentLike: function getCommentLike(author, postId) {
        return CommentLike.find({author, postId}).exec()
    },
    delCommentLike: function delCommentLikeById(commentLike) {
        return CommentLike.remove(commentLike).exec()
    },
    delCommentLikeByCommentId: function delCommentLikeByCommentId(commentId) {
        return CommentLike.remove({commentId}).exec()
    }
}
