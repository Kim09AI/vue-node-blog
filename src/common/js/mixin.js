import {debounce, checkScrollToBottom, timeFormat} from './util'

// 上拉加载
export const pullupMixin = {
    data() {
        return {
            pullupFunc: function() {}
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
    beforeDestroy() {
        // 解绑事件
        window.removeEventListener('scroll', this.pullupFunc)
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

// 处理数据的文章格式
export const postFormatMixin = {
    methods: {
        postFormat(list) {
            let _list = JSON.parse(JSON.stringify(list))

            _list.forEach((item) => {
                Object.keys(item.postId).forEach((key) => {
                    if (key === '_id' || key === 'author') {
                        return
                    }
                    item[key] = item.postId[key]
                })
            })

            // 处理文章id
            list.forEach((item, index) => {
                _list[index].postId = item.postId._id
            })

            return _list
        }
    }
}
