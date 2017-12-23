import axios from '../common/js/axios'

export function getUserInfo() {
    return axios.post('user/getUserInfo')
}

export function editUserInfo(userInfo) {
    return axios.post('user/edit', userInfo, {
        headers: {
            'Content-Type': 'appliction/x-www-form-urlencoded'
        }
    })
}
