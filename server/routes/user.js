const router = require('express').Router()
const UserModel = require('../models/users')
const {success, fail} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

router.post('/getUserInfo', checkLogin, (req, res, next) => {
    let user = req.session.user

    res.send({
        code: success,
        data: user,
        msg: ''
    })
})

// router.post('/edit', checkLogin, (req, res, next) => {
//     let name = req.fields.name
//     let describe = req.fields.describe
//     let email = req.fields.email
//     let pattern = /^[\w\d_-]+@[\w\d]{2,4}(.[\w\d]{2,4})+$/
//     console.log(req.files)

//     let msg
//     if (!msg && name.length < 1 || name.length > 10) {
//         msg = '名字请限制在 1-10 个字符'
//     }

//     if (!msg && email && pattern.test(email)) {
//         msg = '邮箱格式不正确'
//     }

//     if (msg) {
//         return res.send({
//             code: fail,
//             data: [],
//             msg
//         })
//     }
// })

module.exports = router
