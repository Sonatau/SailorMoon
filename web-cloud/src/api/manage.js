import request from '@/utils/request'
import store from '../store'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  orgTree: '/org/tree',
  updatePwd: '/auth/update-password'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function finePhone (parameter) {
  return request({
    url: 'https://api04.aliyun.venuscn.com/mobile',
    method: 'get',
    params: {
      mobile: parameter
    },
    headers: {
      'Authorization': 'APPCODE b56e5839f6cc4e09b9b878d203af3ce0'
    }
  })
}

export function updatePassword(parameter) {
  return request({
    url: api.updatePwd,
    method: 'post',
    data: parameter,
    headers: {
      'token': store.getters.token
    }
  })
}
