const router = require('express').Router()
const FollowAuthorModel = require('../models/followAuthor')
const {success} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 获取所有关注的人
router.get('/', checkLogin, (req, res, next) => {
    let author = req.session.user._id

    FollowAuthorModel.getFollowAuthorByAuthor(author)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 关注
router.post('/create', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let followAuthor = req.body.followAuthor

    let data = {
        author,
        followAuthor
    }

    FollowAuthorModel.create(data)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '关注成功'
            })
        })
        .catch(next)
})

// 取消关注
router.post('/del', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let followAuthor = req.body.followAuthor

    let data = {
        author,
        followAuthor
    }

    FollowAuthorModel.delFollowAuthor(data)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '取消关注'
            })
        })
        .catch(next)
})

// 检查用户是否关注了文章的作者
router.get('/checkFollow', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let followAuthor = req.query.followAuthor

    FollowAuthorModel.getFollowAuthor(followAuthor, author)
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
