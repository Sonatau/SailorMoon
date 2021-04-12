import request from '@/utils/request'
import store from '../store'

const api = {
  getPerList: '/permission/getPerList',
  upsertPer: '/permission/upsertPer',
  deletePer: '/permission/deletePer'
}

export default api

export function getPerList(parameter) {
    return request({
        url: api.getPerList,
        mthod: 'get',
        params: {
            page: parameter.page,
            name: parameter.name
        },
        headers: {
            'token': store.getters.token
        }
    })
}

export function upsertPer(parameter) {
    return request({
        url: api.upsertPer,
        method: 'post',
        data: parameter,
        headers: {
            'token': store.getters.token
        }
    })
}

export function deletePer(parameter) {
    return request({
        url: api.deletePer,
        method: 'get',
        params: {
            id: parameter.id
        },
        headers: {
            'token': store.getters.token
        }
    })
}
