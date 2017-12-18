const CategoryFollowModel = require('../models/categoryFollow')
const router = require('express').Router()
const {success} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 获取关注的分类
router.get('/', checkLogin, (req, res, next) => {
    let author = req.session.user._id

    CategoryFollowModel.getAuthorCategoryFollow(author)
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
    let category = req.fields.category
    let author = req.session.user._id

    let data = {
        category,
        author
    }

    CategoryFollowModel.create(data)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '关注成功'
            })
        })
        .catch(next)
})

router.post('/cancel', checkLogin, (req, res, next) => {
    let category = req.fields.category
    let author = req.session.user._id

    let data = {
        category,
        author
    }

    CategoryFollowModel.delCategoryFollow(data)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '取消关注'
            })
        })
        .catch(next)
})

module.exports = router
