import axios from '../common/js/axios'

export function createComment(postId, content) {
    return axios.post('/comment/create', {
        postId,
        content
    })
}

export function getComments(postId, page = 1, limit = 20) {
    return axios.get('comment', {
        params: {
            page,
            limit,
            postId
        }
    })
}

export function getCommentById(commentId) {
    return axios.get(`comment/${commentId}`)
}

export function createLevelComment(commentId, content) {
    return axios.post('levelComment/create', {
        commentId,
        content
    })
}

export function getLevelComment(commentId, page = 1, limit = 20) {
    return axios.get('levelComment', {
        params: {
            commentId,
            page,
            limit
        }
    })
}

// 获取用户喜欢的评论
export function getUserCommentLikeByPostId(postId) {
    return axios.get(`commentLike/${postId}`)
}

export function commentLikeCreate(data) {
    return axios.post('commentLike/create', data)
}

export function commentLikeCancel(data) {
    return axios.post('commentLike/del', data)
}
