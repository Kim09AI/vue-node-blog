# vue-node-blog

> vue-node-blog

### 描述
一个练手的vue+node的博客，实现的功能有: 发文章、修改文章、文章的喜欢及收藏、关注用户、评论及二级评论、评论点赞、历史记录、我的文章、修改个人资料、一些删除功能等，
登录、注册，以及接入了github第三方登录，并抓取了一些掘金的文章，方便看效果
第一次发的小项目，不足之处以及写的不好的地方，欢迎大家提出来，一起交流！觉得好的话，也欢迎star!<br>
因为用是国外的服务，所以获取数据的时会慢一点。<br>
[线上地址: https://vue-node-blog.herokuapp.com](https://vue-node-blog.herokuapp.com)<br>
[github地址: https://github.com/Kim09AI/vue-node-blog](https://github.com/Kim09AI/vue-node-blog)

### 技术栈
vue、vue-router、vuex、stylus、ES6、nodejs、express、mongodb、Ajax使用axios（前后端共用）

### 运行
#### 开发模式
需全局安装supervisor和cross-env<br>
在项目根目录 `npm install`
启动mongodb再进入server运行 `npm run dev`
然后在项目根目录运行 `npm run dev`

#### 本地以生产模式运行
在项目根目录 `npm run build`
然后启动mongodb再进入server运行 `npm run pro`，
`npm run pro`之前需要在`server/config`添加`production.js`,可参考如下配置,如需其他配置可自行配置
```js
module.exports = {
    homeUrl: '/',
}
```

#### 目录结构
```js
vue-node-blog
├─src
|  ├─App.vue
|  ├─main.js
|  ├─store
|  ├─router
|  ├─components // 业务组件
|  ├─common // js、css等
|  ├─base // 与业务不相关的组件
|  ├─assets
|  ├─api // 前端获取数据的接口
├─server
|   ├─index.js // 主程序
|   ├─package.json
|   ├─routes // 路由文件
|   ├─public // 静态资源
|   ├─models // 存放操作数据库的文件
|   ├─middlewares // 中间件
|   ├─logs
|   ├─lib
|   ├─grabData // 文章抓取程序
|   ├─config // server配置文件

```

```js
// 开发环境使用cors跨域
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
// 前端部分需要设置withCredentials为true才能传输cookie
axios.defaults.withCredentials = true

// 生产环境配合vue-router使用history模式
if (!isDev) {
    app.get('*', (req, res, next) => {
        res.sendFile(path.join(__dirname, '../../dist/index.html'))
    })
}
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

#### 使用keep-alive时的数据获取
```js
// 检测浏览器的前进后退
// 因为使用了keep-alive,会缓存组件在内存中，重新进入时可以在activated中获取数据
// 但是前进后退时我不想获取数据，点击时才需要
// 通过提交mutations来保存是否是前进后退
// 原本是打算在app.vue根组件的created绑定popstate事件，但是vue-router内部也绑定了popstate事件，也就是说vue-router绑定的事件会先执行
// 执行顺序就会是这样 vue-router的popstate ==> 根组件watch $route ==> 子组件的activated ==> 我绑定的popstate,子组件的activated都已经执行了，那我提交的mutations就没有意义了
// 所以需要在new Router({}) 前绑定
window.addEventListener('popstate', () => {
    store.commit('SET_POP_STATE', true)
})

// 进入子组件是会根据isPopState判断是否需要重新获取数据，intoPageCount判断是否是首次进入组件，初始为0
activated() {
    if (this.isPopState || !this.intoPageCount++) return

    // 获取数据
    ...
}

// 执行完activated应该重置isPopState,不然点击的时候isPopState还是true
// 通过在app.vue根组件watch $route
// 因为$route先于子组件的activated执行，通过setTimeout设成异步执行，就可以在activated后执行了
watch: {
    '$route'() {
        if (this.isPopState) {
            // 在同步代码后执行，即组件的activated后面，等待activated判断完成，重置isPopState
            setTimeout(() => {
                this.setPopState(false)
            }, 0)
        }
    }
}
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

// 格式化代码
const timeFormatArr = [0, 60, 3600, 86400, 2592000, 946080000, Number.MAX_VALUE]
const timeUnit = ['刚刚', '分钟前', '小时前', '天前', '月前', '年前']

export function timeFormat(dateStr) {
    let dateTime = new Date(dateStr).getTime()
    let now = new Date().getTime()
    let time = (now - dateTime) / 1000

    let index = timeFormatArr.findIndex((item, index) => {
        return item <= time && timeFormatArr[index + 1] > time
    })

    if (index === 0) {
        return timeUnit[0]
    }

    time = time / timeFormatArr[index] | 0
    return time + timeUnit[index]
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
