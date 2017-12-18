import axios from '../common/js/axios'

// 检查是否收藏了该文章
export function getUserPostCollectionByPostId(postId) {
    return axios.get(`postCollection/${postId}`)
}

export function postCollectionCreate(postId) {
    return axios.post('postCollection/create', {postId})
}

export function postCollectionCancel(postId) {
    return axios.post('postCollection/del', {postId})
}

// 获取收藏的文章
export function getUserPostCollection(page = 1, limit = 20) {
    return axios.get('postCollection', {
        params: {
            page,
            limit
        }
    })
}
