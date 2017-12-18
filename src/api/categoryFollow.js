import axios from '../common/js/axios'

export function categoryFollowCreate(category) {
    return axios.post('categoryFollow/create', {category})
}

export function categoryFollowCancel(category) {
    return axios.post('categoryFollow/cancel', {category})
}

// 获取关注的分类
export function getCategoryFollow() {
    return axios.get('categoryFollow')
}

