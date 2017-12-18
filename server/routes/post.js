const router = require('express').Router()
const PostModel = require('../models/post')
const PostHistoryModel = require('../models/postHistory')
const {success, fail} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

// 获取全部或用户的文章
router.get('/', (req, res, next) => {
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20
    let author = req.query.author

    PostModel.getPosts(author, page, limit)
        .then((datas) => {
            res.send({
                code: success,
                data: datas,
                msg: ''
            })
        })
        .catch(next)
})

// 获取一个类型的的文章
router.get('/category', (req, res, next) => {
    let category = req.query.category
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20

    PostModel.getPostByCategory(category, page, limit)
        .then((data) => {
            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 发表文章
router.post('/create', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let title = req.fields.title
    let content = req.fields.content
    let category = req.fields.category
    let tags = req.fields.tags

    let msg
    if (!msg && !title.length) {
        msg = '请填写标题'
    }

    if (!msg && !content.length) {
        msg = '请填写内容'
    }

    if (msg) {
        return res.send({
            code: fail,
            data: [],
            msg
        })
    }

    const post = {
        author,
        title,
        content,
        category,
        tags
    }

    PostModel.create(post)
        .then((data) => {
            res.send({
                code: success,
                data: data.ops[0],
                msg: '创建成功'
            })
        })
        .catch(next)
})

// 获取一篇文章的内容
router.get('/:postId', (req, res, next) => {
    let postId = req.params.postId
    let author = req.session.user && req.session.user._id

    Promise.all([
        PostModel.getPostById(postId),
        PostModel.incPv(postId)
    ])
        .then((data) => {
            let _data = {
                code: success,
                data: data[0] || [],
                msg: ''
            }

            if (!data[0]) {
                _data.msg = '文章不存在'
            } else if (author) {
                // 删除旧的历史记录再添加新的历史记录
                return PostHistoryModel.delOneHistory({author, postId})
                    .then(() => {
                        return PostHistoryModel.create({author, postId})
                    })
                    .then(() => {
                        res.send(_data)
                    })
            }

            res.send(_data)
        })
        .catch(next)
})

// 获取文章的原始内容
router.get('/:postId/rawPost', checkLogin, (req, res, next) => {
    let postId = req.params.postId
    let author = req.session.user._id

    PostModel.getRawPostById(author, postId)
        .then((data) => {
            if (!data) {
                return res.send({
                    code: fail,
                    data: [],
                    msg: '文章不存在或没有权限'
                })
            }

            res.send({
                code: success,
                data: data,
                msg: ''
            })
        })
        .catch(next)
})

// 修改文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
    let title = req.fields.title
    let content = req.fields.content
    let author = req.session.user._id
    let postId = req.params.postId
    let category = req.fields.category
    let tags = req.fields.tags

    let msg
    if (!msg && !title.length) {
        msg = '请填写标题'
    }

    if (!msg && !content.length) {
        msg = '请填写内容'
    }

    if (msg) {
        return res.send({
            code: fail,
            data: [],
            msg
        })
    }

    let data = {
        title,
        content,
        category,
        tags
    }

    PostModel.updateByPostId(author, postId, data)
        .then((data) => {
            res.send({
                code: success,
                data: [],
                msg: '更新成功'
            })
        })
        .catch(next)
})

// 删除一篇文章
router.post('/:postId/del', checkLogin, (req, res, next) => {
    let postId = req.params.postId
    let author = req.session.user._id

    PostModel.deleteByPostId(author, postId)
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
