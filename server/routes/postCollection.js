const router = require('express').Router()
const PostCollectionModel = require('../models/postCollection')
const checkLogin = require('../middlewares/check').checkLogin
const {success} = require('../public/js/code')

// 用户收藏的文章
router.get('/', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20

    PostCollectionModel.getUserPostCollection(author, page, limit)
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

    let data = {
        author,
        postId
    }

    PostCollectionModel.create(data)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '收藏成功'
            })
        })
        .catch(next)
})

router.post('/del', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.body.postId

    let data = {
        author,
        postId
    }

    PostCollectionModel.delPostCollection(data)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '取消收藏'
            })
        })
        .catch(next)
})

// 检查用户是否收藏某篇文章
router.get('/:postId', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let postId = req.params.postId

    PostCollectionModel.getPostCollection(author, postId)
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
