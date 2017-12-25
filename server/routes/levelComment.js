const router = require('express').Router()
const LevelCommentModel = require('../models/levelComment')
const {success, fail} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 创建二级评论
router.post('/create', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let content = req.body.content
    let commentId = req.body.commentId

    if (!content.length) {
        return res.send({
            code: fail,
            data: [],
            msg: '请输入评论'
        })
    }

    const levelComment = {
        author,
        content,
        commentId
    }

    LevelCommentModel.create(levelComment)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '评论成功'
            })
        })
        .catch(next)
})

// 获取一条评论下的所有二级评论
router.get('/', (req, res, next) => {
    let commentId = req.query.commentId
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20

    LevelCommentModel.getLevelCommentByCommentId(commentId, page, limit)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 删除一条二级评论
router.post('/del', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let levelCommentId = req.body.levelCommentId

    LevelCommentModel.delById(author, levelCommentId)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '删除成功'
            })
        })
        .catch(next)
})

module.exports = router
