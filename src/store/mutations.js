import * as types from './mutation-types'

const mutations = {
    [types.SET_LOGIN_STATE](state, loginState) {
        state.isLogin = loginState
    },
    [types.SET_SIGN_POPUP](state) {
        state.showSignPopup = !state.showSignPopup
    },
    [types.SET_SIGN_TYPE](state, type = 'signin') {
        state.signType = type
    },
    [types.SET_USER_INFO](state, user) {
        state.user = user
    },
}

export default mutations
