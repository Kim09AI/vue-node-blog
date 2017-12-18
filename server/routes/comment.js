const CommentModel = require('../models/comment')
const router = require('express').Router()
const {success, fail} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 获取一篇文章下的所有评论
router.get('/', (req, res, next) => {
    let postId = req.query.postId
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20

    CommentModel.getCommentByPostId(postId, page, limit)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 获取一条评论
router.get('/:commentId', (req, res, next) => {
    let commentId = req.params.commentId

    CommentModel.getCommentById(commentId)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 创建评论
router.post('/create', checkLogin, (req, res, next) => {
    let content = req.fields.content
    let postId = req.fields.postId
    let author = req.session.user._id

    if (!content.length) {
        return res.send({
            code: fail,
            data: [],
            msg: '请输入评论'
        })
    }

    const comment = {
        content,
        author,
        postId
    }

    CommentModel.create(comment)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '评论成功'
            })
        })
        .catch(next)
})

// 删除一条评论
router.post('/del', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let commentId = req.fields.commentId

    CommentModel.delCommentById(author, commentId)
        .then((data) => {
            res.send({
                code: success,
                data: [],
                msg: '删除评论成功'
            })
        })
        .catch(next)
})


module.exports = router
