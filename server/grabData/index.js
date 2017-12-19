const UserModel = require('../models/users')
const PostModel = require('../models/post')
const axios = require('axios')
const toMarkdown = require('to-markdown')
const {commonConfig, categoryArr} = require('./config')

axios.defaults.headers.origin = 'https://juejin.im'

// 获取分类的文章列表
async function getCategoryPost({category, limit = 50}) {
    let url = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank'
    let data = Object.assign({}, commonConfig, {
        category,
        limit
    })

    let entrylist = await axios.get(url, {
        params: data
    })
        .then(({data}) => {
            return data.d.entrylist
        })
        .catch((err) => {
            // 错误处理
        })

    let postList = []
    entrylist.forEach((item, index) => {
        // 跳过不是掘金本站的文章
        if (!item.original) return
        let {title, originalUrl, tags, category, viewsCount} = item
        let postId = originalUrl.split('/')[4]
        // console.log(`postId: ${postId}`)

        if (!postId || !/^[\w\d]+$/.test(postId)) {
            return
        }

        postId.indexOf('?') && (postId = postId.split('?')[0])

        let _tags = getTags(tags)
        postList.push({
            title,
            category: category.name,
            tags: _tags,
            postId,
            pv: viewsCount
        })
    })

    return postList
}

// 获取一篇文章
function getPostById(postId, type = 'entryView') {
    let url = 'https://post-storage-api-ms.juejin.im/v1/getDetailData'
    let data = Object.assign({}, commonConfig, {
        postId,
        type
    })

    return axios.get(url, {
        params: data
    })
        .then(({data}) => {
            return toMarkdown(data.d.content)
        })
        .catch((err) => {
            // 错误处理
        })
}

function getTags(tags) {
    return tags.map((tag) => {
        return tag.title
    })
}

categoryArr.forEach(async (item) => {
    let postList = await getCategoryPost(item)

    await new Promise((resolve, reject) => {
        (async function next(i, len) {
            if (i < len) {
                let post = postList[i]
                let content = await getPostById(post.postId)
                if (typeof content === 'string') {
                    post.content = content
                }
                await sleep(100)
                next(++i, len)
            } else {
                resolve()
            }
        })(0, postList.length)
    })

    let name = 'juejin'
    let password = '123456789'

    let user = await UserModel.getUserByName(name)

    if (!user) {
        user = await UserModel.create({name, password})
    }

    let author = user._id

    let _postList = postList.filter((item, index) => {
        if (!item.content) return false
        item.author = author
        return Object.assign({}, item)
    })

    console.log(_postList.length)

    await PostModel.create(_postList)

    console.log(`${_postList[0].category}: 批量创建成功`)

    await sleep()
})

function sleep(time = 2000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
