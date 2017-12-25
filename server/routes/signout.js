const router = require('express').Router()
const config = require('config-lite')(__dirname)
const checkLogin = require('../middlewares/check').checkLogin
const success = require('../public/js/code').success

router.get('/', checkLogin, (req, res, next) => {
    req.session.destroy()
    res.clearCookie(config.session.key)
    res.send({
        code: success,
        data: [],
        msg: '登出成功'
    })
})

module.exports = router
