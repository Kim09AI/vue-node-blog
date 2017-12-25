const router = require('express').Router()
const UserModel = require('../models/users')
const {success, fail} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin
const path = require('path')
const fs = require('fs')

router.post('/getUserInfo', checkLogin, (req, res, next) => {
    let user = req.session.user

    res.send({
        code: success,
        data: user,
        msg: ''
    })
})

router.post('/edit', checkLogin, (req, res, next) => {
    let author = req.session.user._id
    let loginType = req.session.user.loginType
    let name = req.body.name
    let describe = req.body.describe
    let email = req.body.email
    let pattern = /^[\w\d_-]+@[\w\d]{2,4}(.[\w\d]{2,4})+$/
    let filePath = req.files.avatar && req.files.avatar.path
    let avatar = filePath && filePath.split(path.sep).pop()

    let msg
    if (!msg && name.length < 1 || name.length > 10) {
        msg = '名字请限制在 1-10 个字符'
    }
    
    if (!msg && email && !pattern.test(email)) {
        msg = '邮箱格式不正确'
    }

    if (msg) {
        return res.send({
            code: fail,
            data: [],
            msg
        })
    }
    
    let userInfo = {}
    let _setUserInfo = (data) => {
        for (let item in data) {
            data[item] && (userInfo[item] = data[item])
        }
    }

    _setUserInfo({email, describe, avatar})
    if (loginType) {
        userInfo.originName = name
    } else {
        userInfo.name = name
    }

    UserModel.setUserInfo(author, userInfo)
        .then((data) => {
            return UserModel.getUserById(author)
        })
        .then((user) => {
            delete user.password
            req.session.user = user
            res.send({
                code: success,
                data: user,
                msg: '修改成功'
            })
        })
        .catch((err) => {
            fs.unlink(filePath, () => {})
            next(err)
        })
    
})

module.exports = router
