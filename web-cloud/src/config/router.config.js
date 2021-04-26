// eslint-disable-next-line
import {UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    // name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/permission/PermissionList',
    children: [
      // 权限（角色）管理
      {
        path: '/permission',
        // name: 'permission',
        redirect: '/permission/PermissionList',
        component: RouteView,
        meta: { title: 'menu.permission', keepAlive: true, icon: bxAnaalyse, permission: ['permission'] },
        children: [
          {
            // 权限列表
            path: '/permission/PermissionList',
            name: 'PermissionList',
            component: () => import('@/views/permission/PermissionList'),
            meta: { title: 'menu.permission.list', keepAlive: false, permission: ['permission'] }
          },
          {
            // 新建权限
            path: '/permission/AddPermission/:record?',
            name: 'AddPermission',
            component: () => import('@/views/permission/AddPermission'),
            meta: { title: '添加权限', keepAlive: false, permission: ['permission'] }
          }
        ]
      },
      // 考勤管理
      {
        path: '/attendance',
        name: 'attendance',
        redirect: '/attendance/AttendanceList',
        component: RouteView,
        meta: { title: 'menu.attendance', keepAlive: true, icon: 'carry-out', permission: ['attendance'] },
        children: [
          {
            path: '/attendance/AttendanceList',
            name: 'AttendanceList',
            component: () => import('@/views/attendance/AttendanceList'),
            meta: { title: 'menu.attendance.list', keepAlive: false, permission: ['attendance'] }
          },
          {
            // 新建签到
            path: '/attendance/AddAttendance',
            name: 'AddAttendance',
            component: () => import('@/views/attendance/AddAttendance'),
            meta: { title: 'menu.attendance.add', keepAlive: false, permission: ['attendance'] }
          },
          {
            // 考勤分值等设置
            path: '/attendance/Setting',
            name: 'Setting',
            component: () => import('@/views/attendance/Setting'),
            meta: { title: 'menu.attendance.setting', keepAlive: false, permission: ['attendance'] }
          },
          {
            // 签到详情查看
            path: '/attendance/AttendanceDetail',
            name: 'AttendanceDetail',
            component: () => import('@/views/attendance/AttendanceDetail'),
            meta: { title: 'menu.attendance.detail', keepAlive: false, permission: ['attendance'] }
          }
        ]
      },
      // 机构管理
      {
        path: '/institution',
        name: 'institution',
        redirect: '/institution/InstitutionList',
        component: RouteView,
        meta: { title: 'menu.institution', keepAlive: true, icon: 'cluster', permission: ['institution'] },
        children: [
          {
            // 机构列表
            path: '/institution/InstitutionList',
            name: 'InstitutionList',
            component: () => import('@/views/institution/InstitutionList'),
            meta: { title: 'menu.institution.list', keepAlive: false, permission: ['institution'] }
          },
          {
            // 添加机构
            path: '/institution/AddInstitution',
            name: 'AddInstitution',
            component: () => import('@/views/institution/AddInstitution'),
            meta: { title: 'menu.institution.add', keepAlive: false, permission: ['institution'] }
          }

        ]
      },
      // Exception
      {
        path: '/exception',
        // name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          },
          {
            path: '/exception/600',
            name: 'Exception600',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/600'),
            meta: { title: '自定义异常页', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        // name: 'account',
        meta: { title: '系统设置', icon: 'user', keepAlive: true, permission: ['setting'] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人参数', hideHeader: true, permission: ['setting'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['setting'] }
              }
            ]
          },
          {
            path: '/account/settings/DataDictionary',
            name: 'DataDictionary',
            component: () => import('@/views/account/settings/DataDictionary'),
            meta: { title: '数据字典', hideHeader: true, permission: ['setting'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'forget-password',
        name: 'forgetPassword',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgetPwd')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
