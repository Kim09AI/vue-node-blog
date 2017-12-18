const PostLike = require('../lib/mongo').PostLike

module.exports = {
    create: function create(postLike) {
        return PostLike.create(postLike).exec()
    },
    postLikeCount: function postLikeCount(postId) {
        return PostLike.count({postId}).exec()
    },
    getPostLike: function getPostLike(author, postId) {
        return PostLike.findOne({author, postId}).exec()
    },
    delPostLike: function delPostLike(postLike) {
        return PostLike.remove(postLike).exec()
    },
    delPostLikeByPostId: function delPostLikeByPostId(postId) {
        return PostLike.remove({postId}).exec()
    }
}
