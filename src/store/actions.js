import * as types from './mutation-types'

// 设置弹窗显示及类型
export function setSignPopup({commit}, type) {
    commit(types.SET_SIGN_POPUP)
    commit(types.SET_SIGN_TYPE, type)
}

// 保存用户信息和登录状态
export function saveUserInfo({commit}, {user, loginState}) {
    commit(types.SET_LOGIN_STATE, loginState)
    commit(types.SET_USER_INFO, user)
}
