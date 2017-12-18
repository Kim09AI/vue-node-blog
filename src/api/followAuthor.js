import axios from '../common/js/axios'

// 检查是否关注了某位用户
export function getByFollowAuthor(followAuthor) {
    return axios.get('followAuthor/checkFollow', {
        params: {
            followAuthor
        }
    })
}

export function followAuthorCreate(followAuthor) {
    return axios.post('followAuthor/create', {followAuthor})
}

export function followAuthorCancel(followAuthor) {
    return axios.post('followAuthor/del', {followAuthor})
}

// 获取关注的所有用户
export function getFollowAuthor() {
    return axios.get('followAuthor')
}
