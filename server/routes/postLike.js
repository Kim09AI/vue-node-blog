const router = require('express').Router()
const PostLikeModel = require('../models/postLike')
const checkLogin = require('../middlewares/check').checkLogin
const {success} = require('../public/js/code')

router.post('/create', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.fields.postId

    let data = {
        author,
        postId
    }

    PostLikeModel.create(data)
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
    let postId = req.fields.postId

    let data = {
        author,
        postId
    }

    PostLikeModel.delPostLike(data)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '取消成功'
            })
        })
        .catch(next)
})

// 检查用户是否关注了某篇文章
router.get('/:postId', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.params.postId

    PostLikeModel.getPostLike(author, postId)
        .then((data) => {
            res.send({
                code: success,
                data: data || [],
                msg: ''
            })
        })
        .catch(next)
})

module.exports = router
