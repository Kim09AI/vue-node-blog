const unExist = require('../public/js/code').unExist
const responseType = require('../middlewares/responseType')
const path = require('path')
const addApiPrefix = require('../public/js/util').addApiPrefix

const isDev = process.env.NODE_ENV !== 'production'

module.exports = function(app) {
    // 设置响应类型
    app.use(responseType)

    app.use(addApiPrefix('/signin'), require('./signin'))
    app.use(addApiPrefix('/signup'), require('./signup'))
    app.use(addApiPrefix('/signout'), require('./signout'))
    app.use(addApiPrefix('/post'), require('./post'))
    app.use(addApiPrefix('/comment'), require('./comment'))
    app.use(addApiPrefix('/levelComment'), require('./levelComment'))
    app.use(addApiPrefix('/postHistory'), require('./postHistory'))
    app.use(addApiPrefix('/commentLike'), require('./commentLike'))
    app.use(addApiPrefix('/postLike'), require('./postLike'))
    app.use(addApiPrefix('/postCollection'), require('./postCollection'))
    app.use(addApiPrefix('/followAuthor'), require('./followAuthor'))
    app.use(addApiPrefix('/categoryFollow'), require('./categoryFollow'))
    app.use(addApiPrefix('/user'), require('./user'))

    if (isDev) {
        app.use((req, res, next) => {
            if (!res.headersSent) {
                res.status(404)
                res.send({
                    code: unExist,
                    data: [],
                    msg: '资源不存在'
                })
            }
        })
    } else {
        // 生产环境配合vue-router使用history模式
        app.use('*', (req, res, next) => {
            if (!res.headersSent) {
                res.sendFile(path.join(__dirname, '../../dist/index.html'))
            }
        })
    }
}
