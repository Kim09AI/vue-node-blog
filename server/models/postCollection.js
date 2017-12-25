const PostCollection = require('../lib/mongo').PostCollection

module.exports = {
    create: function create(postCollection) {
        return PostCollection.create(postCollection).exec()
    },
    getPostCollection: function getPostCollection(author, postId) {
        return PostCollection.findOne({author, postId}).exec()
    },
    getUserPostCollection: function getUserPostCollection(author, page = 1, limit = 20) {
        let start = (page - 1) * limit

        return PostCollection.find({author})
            .skip(start)
            .limit(limit)
            .populate({path: 'postId', model: 'Post'})
            .populate({path: 'postId.author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .exec()
    },
    delPostCollection: function delPostCollection(postCollection) {
        return PostCollection.remove(postCollection).exec()
    },
    delPostCollectionByPostId: function delPostCollectionByPostId(postId) {
        return PostCollection.remove({postId}).exec()
    }
}
