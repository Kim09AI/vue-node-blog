const router = require('express').Router()
const config = require('config-lite')(__dirname)
const axios = require('axios')
const UserModel = require('../models/users')
const {bcryptCompare, queryStr} = require('../public/js/util')
const {loginFail, success, unLogin} = require('../public/js/code')
const checkLogin = require('../middlewares/check').checkLogin

router.post('/', (req, res, next) => {
    let name = req.fields.name
    let password = req.fields.password

    UserModel.getUserByName(name)
        .then((user) => {
            if (!user) {
                res.send({
                    code: loginFail,
                    data: [],
                    msg: '用户不存在'
                })
                return
            }

            return Promise.all([
                bcryptCompare(password, user.password),
                user
            ])
        })
        .then(([result, user]) => {
            if (result) {
                delete user.password
                req.session.user = user
                res.send({
                    code: success,
                    data: user,
                    msg: '登录成功'
                })
            } else if (result === false) {
                res.send({
                    code: loginFail,
                    data: [],
                    msg: '密码错误'
                })
            }
        })
        .catch(next)
})


let loginUrl = 'https://github.com/login/oauth/authorize'
let tokenUrl = 'https://github.com/login/oauth/access_token'
let userinfoUrl = 'https://api.github.com/user'

router.get('/github', (req, res, next) => {
    let redirect = req.query.redirect || ''
    let url = loginUrl + '?' + queryStr({client_id: config.client_id, scope: config.scope, state: redirect})
    res.redirect(url)
})

router.get('/github/oauth/callback', (req, res, next) => {
    let code = req.query.code
    let redirect = req.query.state
    let redirectUrl = redirect ? `${config.homeUrl}?redirect=${redirect}` : config.homeUrl

    let data = {
        client_id: config.client_id,
        client_secret: config.client_secret,
        code: code
    }

    axios.post(tokenUrl, data) // 获取token
        .then(({data}) => {
            let token = data.match(/access_token=([\w\d]+)&/)[1]
            let url = userinfoUrl + '?access_token=' + token
            return axios.get(url) // 获取用户信息
        })
        .then(({data}) => {
            let prefix = '__github__'
            let originName = data.login
            let name = prefix + originName
            let otherUserId = data.id + ''

            let githubUser = {
                originName,
                name,
                otherUserId,
                loginType: 'github'
            }

            return Promise.all([
                UserModel.getUserByOtherUserId(otherUserId),
                githubUser
            ])
        })
        .then(([user, githubUser]) => {
            if (!user) {
                return UserModel.create(githubUser)
            }

            req.session.user = user
            res.redirect(redirectUrl)
        })
        .then((data) => {
            if (data) {
                req.session.user = data.ops[0]
                res.redirect(redirectUrl)
            }
        })
        .catch(next)
})

module.exports = router
