import Mock from 'mockjs2'
import store from '../../store'
import { builder } from '../util'

const info = (options) => {
  const temp = store.getters.temp
  console.log(store.getters.token)
  console.log(1, temp)
  const userInfo = {
    'role': { 'permissions': temp['permissions'] },
    'email': temp['email'],
    'lastLoginTime': new Date(),
    'token': temp['token']
  }
  // 用户可访问的路由加载
  // const roleObj = {
  //   'permissions': [{
  //     'roleId': 'admin',
  //     'permissionId': 'permission',
  //     'permissionName': '权限管理',
  //     'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
  //     'actionEntitySet': [{
  //       'action': 'add',
  //       'describe': '新增',
  //       'defaultCheck': false
  //     }, {
  //       'action': 'query',
  //       'describe': '查询',
  //       'defaultCheck': false
  //     }, {
  //       'action': 'get',
  //       'describe': '详情',
  //       'defaultCheck': false
  //     }, {
  //       'action': 'update',
  //       'describe': '修改',
  //       'defaultCheck': false
  //     }, {
  //       'action': 'delete',
  //       'describe': '删除',
  //       'defaultCheck': false
  //     }],
  //     'actionList': null,
  //     'dataAccess': null
  //   }, {
  //     'permissionId': 'exception',
  //     'permissionName': '异常页显示'
  //   },
  //   {
  //     'permissionId': 'attendance',
  //     'permissionName': '考勤管理'
  //   },
  //   {
  //     'permissionId': 'institution',
  //     'permissionName': '机构管理'
  //   },
  //   {
  //     'permissionId': 'setting',
  //     'permissionName': '系统设置'
  //   }]
  // }
  // userInfo.role = roleObj
  console.log(2, userInfo)
  return builder(userInfo)
  // return store.getters.info // 返回全局存储的权限信息
}

// 这玩意没啥用啊 具体看看文档吧
const userNav = (options) => {
  const nav = [
    // 权限管理
  ]
  const json = builder(nav)
  console.log('json', json)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
