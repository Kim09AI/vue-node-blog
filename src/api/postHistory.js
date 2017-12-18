import axios from '../common/js/axios'

export function getPostHistory(page = 1, limit = 20) {
    return axios.get('postHistory', {
        params: {
            page,
            limit
        }
    })
}

export function delHistoryById(historyId) {
    return axios.post(`postHistory/${historyId}`)
}
