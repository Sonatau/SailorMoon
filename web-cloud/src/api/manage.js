import request from '@/utils/request'
import store from '../store'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  orgTree: '/org/tree',
  updatePwd: '/auth/update-password'
}
// const address = 'http://47.93.231.158:8080/'
const apiParams = {
  'token': store.getters.token
}

export default api

export function getUserList(parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

// export function getRoleList(parameter) {
//   return request({
//     url: api.role,
//     method: 'get',
//     params: parameter
//   })
// }

export function getServiceList(parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub(sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function finePhone(parameter) {
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

// 获取某页的数据字典
export function getAllDict(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary',
    method: 'get',
    headers: {
      'token': store.getters.token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
      'page': parameter.page
    }
  })
}

// 根据中/英文标识查询数据字典
export function queryDict(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary',
    method: 'get',
    headers: {
      'token': store.getters.token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
      'page': parameter.page,
      'label': parameter.name
    }
  })
}

// 添加数据字典
export function addDictionary(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary',
    method: 'post',
    headers: apiParams,
    data: parameter
  })
}

// 编辑数据字典的基本信息
export function editDict(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary',
    method: 'put',
    headers: apiParams,
    data: parameter
  })
}

// 删除数据字典
export function delDict(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary',
    method: 'delete',
    headers: apiParams,
    params: {
      'ids': parameter.id
    }
  })
}

// 获取某个数据字典的所有数据项
export function getDictDetail(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary-detail',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

/**
 * @param {*} parameter including name,value,isDefault,type,parentId
 * @returns respCode
 */
export function addDictDetail(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary-detail',
    method: 'post',
    headers: apiParams,
    data: parameter
  })
}
/**
 * @param {*} parameter id
 * @returns respCode
 */
export function deleteDictDetail(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary-detail',
    method: 'delete',
    headers: apiParams,
    params: parameter
  })
}

// 修改数据字典的数据项
export function editDictDetail(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/dictionary-detail',
    method: 'put',
    headers: apiParams,
    data: parameter
  })
}

export function getSystemParam(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/system-manage',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

export function addSystemParam(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/system-manage',
    method: 'post',
    headers: apiParams,
    data: parameter
  })
}

export function editSystemParam(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/system-manage',
    method: 'put',
    headers: apiParams,
    data: parameter
  })
}

export function deleteSystemParam(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/system-manage',
    method: 'delete',
    headers: apiParams,
    params: parameter
  })
}

export function getListRole(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

export function addRole(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role',
    method: 'post',
    headers: apiParams,
    data: {
      name: parameter.name,
      roleDescribe: parameter.roleDescribe
    }
  })
}

export function editRole(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role',
    method: 'put',
    headers: apiParams,
    data: parameter
  })
}

export function deleteRole(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role',
    method: 'delete',
    headers: apiParams,
    params: parameter
  })
}

export function getPower(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/power',
    method: 'get',
    headers: apiParams
  })
}

export function getRolePower(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role-power',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

export function addRolePower(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role-power',
    method: 'post',
    headers: apiParams,
    data: parameter
  })
}

export function deleteRolePower(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role-power',
    method: 'delete',
    headers: apiParams,
    params: parameter
  })
}

export function getRoleStudent(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role-student',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}
export function getRoleTeacher(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/role-teacher',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

export function getSchoolList(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/school',
    method: 'get',
    headers: apiParams,
    params: parameter
  })
}

export function deleteSchoolList(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/school',
    method: 'delete',
    headers: apiParams,
    params: parameter
  })
}

export function addSchool(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/school',
    method: 'post',
    headers: apiParams,
    data: parameter
  })
}

export function editSchool(parameter) {
  return request({
    url: 'http://47.93.231.158:8080/school',
    method: 'put',
    headers: apiParams,
    data: parameter
  })
}
