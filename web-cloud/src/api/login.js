import request from '@/utils/request'

const userApi = {
  // Login: '/auth/login',
  Logout: '/auth/logout',
  UpdatePassword: '/auth/update-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: 'http://47.93.231.158:8080/login',
    // url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function loginCode (parameter) {
  return request({
    url: 'http://47.93.231.158:8080/login-code',
    // url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function sendMessage (parameter) {
  return request({
    url: 'http://47.93.231.158:8080/send-message',
    // url: userApi.Login,
    method: 'get',
    params: {
      'phone': parameter
    }
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
