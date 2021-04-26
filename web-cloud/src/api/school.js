import request from '@/utils/request'
import store from '../store'

const api = {
  getSchoolList: '/school/getSchoolList',
  addSchool: '/school/addSchool',
  updateSchool: '/school/updateSchool',
  deleteSchool: '/school/deleteSchool'
}

export default api

export function getSchoolList(parameter) {
    return request({
        url: api.getSchoolList,
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

export function addSchool(parameter) {
    return request({
        url: api.upsertSchool,
        method: 'post',
        data: parameter,
        headers: {
            'token': store.getters.token
        }
    })
}

export function updateSchool(parameter) {
    return request({
        url: api.updateSchool,
        method: 'post',
        data: parameter,
        headers: {
            'token': store.getters.token
        }
    })
}

export function deleteSchool(parameter) {
    return request({
        url: api.deleteSchool,
        method: 'del',
        params: {
            id: parameter.id
        },
        headers: {
            'token': store.getters.token
        }
    })
}
