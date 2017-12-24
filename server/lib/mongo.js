const config = require('config-lite')
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

const mongolass = new Mongolass()

const mongodb = process.env.PROD_MONGODB || config.mongodb

mongolass.connect(mongodb)

mongolass.plugin('addCreatedAt', {
    afterFind(results) {
        results.forEach((item) => {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne(result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

exports.User = mongolass.model('User', {
    name: {
        type: 'string'
    },
    originName: {
        type: 'string'
    },
    avatar: {
        type: 'string'
    },
    password: {
        type: 'string'
    },
    email: {
        type: 'string'
    },
    describe: {
        type: 'string'
    },
    loginType: {
        type: 'string'
    },
    otherUserId: { // 第三方登录的用户id
        type: 'string'
    }
})

exports.User.index({name: 1}, {unique: true}).exec()

// 文章
exports.Post = mongolass.model('Post', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    title: {
        type: 'string'
    },
    content: {
        type: 'string'
    },
    tags: { // 这里有点奇怪，设成['string'], 'array'都不行，暂时没找到文档
        type: String
    },
    category: {
        type: 'string'
    },
    pv: {
        type: 'number'
    }
})

exports.Post.index({author: 1, _id: -1}).exec()

// 文章的喜欢
exports.PostLike = mongolass.model('PostLike', {
    postId: {
        type: Mongolass.Types.ObjectId
    },
    author: {
        type: Mongolass.Types.ObjectId
    }
})

exports.PostLike.index({postId: 1, _id: 1}).exec()

// 评论
exports.Comment = mongolass.model('Comment', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    content: {
        type: 'string'
    },
    postId: {
        type: Mongolass.Types.ObjectId
    }
})

exports.Comment.index({author: 1, _id: 1}).exec()
exports.Comment.index({postId: 1, _id: 1}).exec()

// 二级评论
exports.LevelComment = mongolass.model('LevelComment', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    content: {
        type: 'string'
    },
    commentId: {
        type: Mongolass.Types.ObjectId
    }
})

exports.LevelComment.index({author: 1, _id: 1}).exec()
exports.LevelComment.index({commentId: 1, _id: 1}).exec()

// 文章的浏览历史
exports.PostHistory = mongolass.model('PostHistory', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    postId: {
        type: Mongolass.Types.ObjectId
    }
})

exports.PostHistory.index({author: 1, _id: -1}).exec()

// 喜欢的评论
exports.CommentLike = mongolass.model('CommentLike', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    commentId: {
        type: Mongolass.Types.ObjectId
    },
    postId: {
        type: Mongolass.Types.ObjectId
    }
})

exports.CommentLike.index({postId: 1, _id: 1})

// 收藏的文章
exports.PostCollection = mongolass.model('PostCollection', {
    postId: {
        type: Mongolass.Types.ObjectId
    },
    author: {
        type: Mongolass.Types.ObjectId
    }
})

exports.PostCollection.index({author: 1, _id: -1}).exec()

// 关注的用户
exports.FollowAuthor = mongolass.model('FollowAuthor', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    followAuthor: { // 被关注的用户
        type: Mongolass.Types.ObjectId
    }
})

exports.FollowAuthor.index({author: 1, _id: -1}).exec()

// 分类关注
exports.CategoryFollow = mongolass.model('CategoryFollow', {
    category: {
        type: 'string'
    },
    author: {
        type: Mongolass.Types.ObjectId
    }
})

exports.CategoryFollow.index({author: 1, _id: 1}).exec()
