const state = {
    isLogin: document.cookie.indexOf('vue_node_blog') > -1,
    showSignPopup: false,
    signType: 'signin', // 弹窗类型，登录或注册
    user: null,
    isPopState: false, // 浏览器的前进后退，是前进后退就不获取数据，是点击就重置组件状态并获取数据
}

export default state
