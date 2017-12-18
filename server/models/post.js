const Post = require('../lib/mongo').Post
const CommentModel = require('./comment')
const PostLikeModel = require('./postLike')
const PostCollectionModel = require('./postCollection')
const marked = require('marked')
const PostHistoryModel = require('./postHistory')

// markdown转html
Post.plugin('contentToHtml', {
    afterFind(posts) {
        return posts.map((post) => {
            post.content = marked(post.content)
            return post
        })
    },
    afterFindOne(post) {
        if (post) {
            post.content = marked(post.content)
        }
        return post
    }
})

// 添加评论数量
Post.plugin('addCommentCount', {
    afterFind(posts) {
        return Promise.all(posts.map((post) => {
            return CommentModel.commentCount(post._id).then((commentCount) => {
                post.commentCount = commentCount
                return post
            })
        }))
    },
    afterFindOne(post) {
        if (post) {
            return CommentModel.commentCount(post._id).then((commentCount) => {
                post.commentCount = commentCount
                return post
            })
        }
        return post
    }
})

// 添加文章的喜欢数
Post.plugin('addPostLikeCount', {
    afterFindOne(post) {
        if (post) {
            return PostLikeModel.postLikeCount(post._id).then((postLikeCount) => {
                post.postLikeCount = postLikeCount
                return post
            })
        }
        return post
    }
})

module.exports = {
    create: function create(post) {
        return Post.create(post).exec()
    },
    getPostById: function getPostById(postId) {
        return Post.findOne({_id: postId})
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .addCreatedAt()
            .contentToHtml()
            .addCommentCount()
            .addPostLikeCount()
            .exec()
    },
    getRawPostById: function getRawPostById(author, postId) {
        return Post.findOne({author: author, _id: postId})
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .exec()
    },
    getPosts: function getPosts(author, page = 1, limit = 20) {
        let start = (page - 1) * 20
        let query = {}
        author && (query.author = author)

        return Post.find(query)
            .skip(start)
            .limit(limit)
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .contentToHtml()
            .addCommentCount()
            .exec()
    },
    getPostByCategory: function getPosts(category, page = 1, limit = 20) {
        let start = (page - 1) * 20

        return Post.find({category})
            .skip(start)
            .limit(limit)
            .populate({path: 'author', select: {password: 0}, model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .contentToHtml()
            .addCommentCount()
            .exec()
    },
    updateByPostId: function updateByPostId(author, postId, data) {
        return Post.update({author: author, _id: postId}, {$set: data}).exec()
    },
    deleteByPostId: function deleteByPostId(author, postId) {
        return Post
            .remove({author: author, _id: postId})
            .exec()
            .then((res) => {
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.getCommentByPostId(postId)
                        .then((comments) => {
                            // 删除一、二级评论
                            let promiseArr = comments.map((comment) => {
                                return CommentModel.delCommentById(undefined, comment._id)
                            })

                            // 文章的历史记录
                            promiseArr.push(PostHistoryModel.delHistoryByPostId(postId))

                            // 文章的喜欢
                            promiseArr.push(PostLikeModel.delPostLikeByPostId(postId))

                            // 文章的收藏
                            promiseArr.push(PostCollectionModel.delPostCollectionByPostId(postId))

                            return Promise.all(promiseArr)
                        })
                }
            })
    },
    incPv: function incPv(postId) {
        return Post.update({_id: postId}, {$inc: {pv: 1}}).exec()
    },
    postCountByAuthor: function postCountByAuthor(author) {
        return Post.count({author}).exec()
    }
}
