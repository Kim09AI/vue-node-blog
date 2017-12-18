const crypto = require('crypto')
const bcrypt = require('bcryptjs')

exports.getSha1 = function(str) {
    let sha1 = crypto.createHash("sha1")
    sha1.update(str)
    let res = sha1.digest("hex")
    return res
}

exports.queryStr = function(options = {}) {
    let str = ''
    for (let key in options) {
        str += `&${key}=${encodeURIComponent(options[key])}`
    }
    return str.substr(1)
}

exports.getBcrypt = function(password, saltRounds = 10) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return reject(err)
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err)
                }

                resolve(hash)
            })
        })
    })
}

exports.bcryptCompare = function(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

exports.addApiPrefix = function(url) {
    return `/api${url}`
}
