// 开发、生产环境判断
export const isDev = process.env.NODE_ENV === 'development'

export const ERR_OK = 0

export const unLogin = -2

export function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

export function queryStr(data) {
    let str = ''
    for (let key in data) {
        str += `&${key}=${encodeURIComponent(data[key])}`
    }
    return str.substr(1)
}

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

export function format(fmt, date = new Date()) {
    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function debounce(fn, time = 100, context) {
    let timer
    return function(...args) {
        clearTimeout(timer)

        timer = setTimeout(() => {
            context = context || this
            fn.apply(context, ...args)
        }, time)
    }
}

export function checkScrollToBottom(delay = 50) {
    let windowH = window.innerHeight
    let docH = document.documentElement.scrollHeight || document.body.scrollHeight
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

    if (windowH + scrollTop >= docH - delay) {
        return true
    }
    return false
}
