# vue-node-blog

> vue-node-blog

### 描述
一个练手的vue+node的博客，实现的功能有: 发文章、修改文章、文章的喜欢及收藏、关注用户、评论及二级评论、评论点赞、历史记录、一些删除功能等，
登录、注册，以及接入了github第三方登录，都是一些比较基础的功能，并抓取了一些掘金的文章，方便看效果
第一次发的小项目，不足之处以及写的不好的地方，欢迎大家提出来！

### 技术栈
vue、vue-router、vuex、stylus、ES6、nodejs、express、mongodb、Ajax使用axios（前后端共用）

### 运行
#### 开发模式
在项目根目录 `npm install`
进入server `npm install`
启动mongodb再进入server运行 `npm run dev`
然后在项目根目录运行 `npm run dev`

#### 本地以生产模式运行
在项目根目录 `npm run build`
启动mongodb再进入server运行 `npm run pro`

```js
// 开发环境使用cors跨域
if (isDev) {
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080")
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
// 前端部分需要设置withCredentials为true才能传输cookie
axios.defaults.withCredentials = true


// 生产环境配合vue-router使用history模式
app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'))
})
```

#### 前端登录状态判断,需要登录才能进行的操作未登录就弹出登录弹窗
```js
// 在路由的meta 添加 meta: {shouldLogin: true}
// 全局的页面级别的登录状态判断
router.beforeEach((to, from, next) => {
    let shouldLogin = to.meta.shouldLogin
    let isLogin = store.getters.isLogin

    if (shouldLogin && !isLogin) {
        store.dispatch('setSignPopup', 'signin')
        next({
            path: from.fullPath,
            query: {redirect: to.fullPath}
        })
    } else {
        next()
    }
})

// 在根节点绑定一个捕获的click事件，全局处理
// <div id="app" @click.capture="shouldCheckLoigin">
// 以及在需要检测的元素上添加一个自定义属性 data-shouldLogin="true"
shouldCheckLoigin(e) { // 全局的检查页面中需要登录才能执行的操作，如关注、收藏、评论按钮等
    let shouldLogin = e.target.getAttribute('data-shouldLogin') === 'true'
    if (shouldLogin && !this.isLogin) {
        // 弹窗并阻止事件传播
        this.setSignPopup('signin')
        e.stopPropagation()
    }
},
```

#### 两个异步请求同时发的时候有一个404了
```js
// 在开发环境下，刚开始只是获取文章和评论，两个请求同时发，结果有一个404了，都是这个错误Can't set headers after they are sent.,生产环境也一样，只不过有时候状态码是200，一会是404
// 百度了一般都是重复响应res.send()，但是我的代码好像也找不到哪里有重复发，实在找不到了向大家请教
// 一个请求一个请求的发是可以的，所以最后才改成了这样promise链式调用的方法
getPostById(this.postId)
    .then(({data}) => {
        if (data.code === ERR_OK) {
            this.post = data.data
        }
    })
    .then(() => {
        return this._getComments()
    })
    .then(() => {
        if (!this.isLogin) {
            // 没登录就跳过后面的then
            throw new Error('noLogin')
        }

        return this._getUserPostCollectionByPostId()
    })
    .then(() => {
        return this._getByFollowAuthor()
    })
    .then(() => {
        return this._getUserPostLikeByPostId()
    })
    .then(() => {
        return this._getUserCommentLikeByPostId()
    })
    .catch((err) =>{
        if (err.message !== 'noLogin') {
            console.log(err)
        }
    })
```

#### 密码处理
```js
// 使用bcrypt加密，简单的封装成promise的方式使用
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

// 验证
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
```

#### 封装了上拉加载数据和时间格式化的mixin，简单的处理了一下
```js
// 上拉加载
export const pullupMixin = {
    data() {
        return {
            pullupFunc: null
        }
    },
    methods: {
        pullup(fn) {
            this.pullupFunc = debounce(() => {
                let scorllToBottom = checkScrollToBottom()
                scorllToBottom && fn()
            })

            window.addEventListener('scroll', this.pullupFunc)
        }
    },
    activated() {
        this.pullupFunc && window.addEventListener('scroll', this.pullupFunc)
    },
    deactivated() {
        this.pullupFunc && window.removeEventListener('scroll', this.pullupFunc)
    },
    beforeDestroy() {
        // 解绑事件
        this.pullupFunc && window.removeEventListener('scroll', this.pullupFunc)
    }
}

// 格式化时间成 刚刚、一分钟...
export const timeFormatMixin = {
    methods: {
        timeFormat(list) {
            return list.map((item) => {
                item.time = timeFormat(item.created_at)
                return item
            })
        }
    }
}
```

#### 文章抓取
```js
// 文章列表获取是比较方便的，主要还是文章获取那里，以下是主要代码
// token也是会过期的，要是失败了，token等参数等可自行替换
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

// 以async await + promise的方式，一篇一篇文章的获取
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
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
