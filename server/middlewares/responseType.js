let type = 'json'

module.exports = function(req, res, next) {
    if (/^\/api/.test(req.url)) {
        res.type(type)
    }
    next()
}
