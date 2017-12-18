import axios from 'axios'
import store from '../../store'
import {isDev, unLogin} from './util'

// 开发环境设置跨域并传输cookie
if (isDev) {
    axios.defaults.baseURL = 'http://localhost:3000/api'
    axios.defaults.withCredentials = true
} else {
    axios.defaults.baseURL = '/api'
}

// axios.defaults.headers.post['Content-Type'] = 'appliction/x-www-form-urlencoded'

//添加一个返回拦截器
axios.interceptors.response.use(function(response) {
    //对返回的数据进行一些处理
    if (response.data.code === unLogin) {
        // 登录状态下手动清除cookie,更新用户信息并弹出登录弹窗
        if (store.getters.isLogin) {
            store.dispatch('saveUserInfo', {user: null, loginState: false})
            store.dispatch('setSignPopup', 'signin')
        }
    }
    return response
},function(error) {
    //对返回的错误进行一些处理
    return Promise.reject(error)
})

export default axios
