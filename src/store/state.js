const state = {
    isLogin: document.cookie.indexOf('vue_node_blog') > -1,
    showSignPopup: false,
    signType: 'signin', // 弹窗类型，登录或注册
    user: null,
}

export default state
