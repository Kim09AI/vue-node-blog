const router = require('express').Router()
const UserModel = require('../models/users')
const {getBcrypt} = require('../public/js/util')
const {signupFail, success} = require('../public/js/code')

router.post('/', (req, res, next) => {
    let name = req.body.name
    let password = req.body.password
    let repassword = req.body.repassword

    let msg
    if (!msg && name.length < 1 || name.length > 10) {
        msg = '名字请限制在 1-10 个字符'
    }

    if (!msg && password.length < 6) {
        msg = '密码至少 6 个字符'
    }

    if(!msg && password !== repassword) {
        msg = '两次输入密码不一致'
    }

    if (msg) {
        return res.send({
            code: signupFail,
            data: [],
            msg
        })
    }

    getBcrypt(password)
        .then((hash) => {
            let user = {
                name,
                password: hash
            }

            return UserModel.create(user)
        })
        .then((data) => {
            res.send({
                code: success,
                data: data.result,
                msg: '注册成功'
            })
        })
        .catch((err) => {
            if (err.message.match('duplicate key')) {
                return res.send({
                    code: signupFail,
                    data: [],
                    msg: '用户名已存在'
                })
            }
            next(err)
        })
})

module.exports = router
