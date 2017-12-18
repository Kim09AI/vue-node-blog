const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('../package')
const winston = require('winston')
const expressWinston = require('express-winston')

const serverErr = require('./public/js/code').serverErr

const app = express()

// 隐藏 x-powered-by
app.disable('x-powered-by')

const isDev = process.env.NODE_ENV !== 'production'

if (isDev) {
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", config.homeUrl)
        res.header("Access-Control-Allow-Credentials", true) // 携带cookie
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
        if (req.method == "OPTIONS") {
            res.send(200) // 让options请求快速返回
        } else {
            next()
        }
    })
}

app.use(express.static(path.join(__dirname, 'public')))

// 生产环境增加编译后的dist静态资源
if (!isDev) {
    app.use(express.static(path.join(__dirname, '../dist')))
}

app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge,
        httpOnly: false
    },
    store: new MongoStore({
        url: config.mongodb
    })
}))

app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}))

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))

routes(app)

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

app.use((err, req, res, next) => {
    let errData = {
        code: serverErr,
        data: [],
        msg: err.message
    }

    res.status(500)
    res.send(errData)
})

if (module.parent) {
    module.exports = app
} else {
    const port = process.env.PORT || config.port
    app.listen(port, () => {
        console.log(`${pkg.name} listening on port ${port}`)
    })
}
