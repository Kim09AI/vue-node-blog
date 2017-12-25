const router = require('express').Router()
const CommentLikeModel = require('../models/commentLike')
const {success} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 获取用户在某篇文章下点赞的所有评论
router.get('/:postId', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.params.postId

    CommentLikeModel.getCommentLike(author, postId)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

router.post('/create', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.body.postId
    let commentId = req.body.commentId

    const data = {
        author,
        postId,
        commentId
    }

    CommentLikeModel.create(data)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '喜欢成功'
            })
        })
        .catch(next)
})

router.post('/del', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let commentId = req.body.commentId

    const data = {
        author,
        commentId
    }

    CommentLikeModel.delCommentLike(data)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '取消成功'
            })
        })
        .catch(next)
})

module.exports = router
