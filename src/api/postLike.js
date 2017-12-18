import axios from '../common/js/axios'

export function getUserPostLikeByPostId(postId) {
    return axios.get(`postLike/${postId}`)
}

export function postLikeCreate(postId) {
    return axios.post('postLike/create', {postId})
}

export function postLikeCancel(postId) {
    return axios.post('postLike/del', {postId})
}
