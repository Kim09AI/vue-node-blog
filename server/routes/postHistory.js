const router = require('express').Router()
const PostHistoryModel = require('../models/postHistory')
const checkLogin = require('../middlewares/check').checkLogin
const {success} = require('../public/js/code')

// 获取文章浏览历史
router.get('/', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20

    PostHistoryModel.getHistoryByAuthor(author, page, limit)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

router.post('/:historyId', checkLogin, (req, res, next) => {
    let historyId = req.params.historyId

    PostHistoryModel.delOneHistory({_id: historyId})
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '删除成功'
            })
        })
        .catch(next)
})

router.post('/', checkLogin, (req, res, next) => {
    let author = req.session.user._id

    PostHistoryModel.delHistoryByAuthor(author)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: '全部删除成功'
            })
        })
        .catch(next)
})

module.exports = router
