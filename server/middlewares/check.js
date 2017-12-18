const {unLogin} = require('../public/js/code')

module.exports = {
    checkLogin(req, res, next) {
        if (!req.session.user) {
            res.type('json')
            return res.send({
                code: unLogin,
                data: [],
                msg: '未登录'
            })
        }
        next()
    }
}
