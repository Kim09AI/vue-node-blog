import axios from '../common/js/axios'

export function create({title, content, category, tags = []}) {
    return axios.post('post/create', {
        title,
        content,
        category,
        tags
    })
}

// 获取全部或用户的文章
export function getPosts(author, page = 1, limit = 20) {
    return axios.get('post', {
        params: {
            author,
            page,
            limit
        }
    })
}

// 通过分类获取文章列表
export function getPostByCategory(category, page = 1, limit = 20) {
    return axios.get('post/category', {
        params: {
            category,
            page,
            limit
        }
    })
}

// 获取一篇文章
export function getPostById(postId) {
    return axios.get(`post/${postId}`)
}

// 获取文章原始内容
export function getRawPost(postId) {
    return axios.get(`post/${postId}/rawPost`)
}

export function updatePost({title, content, postId, category, tags = []}) {
    return axios.post(`post/${postId}/edit`, {
        title,
        content,
        category,
        tags
    })
}

export function delPostById(postId) {
    return axios.post(`post/${postId}/del`)
}
