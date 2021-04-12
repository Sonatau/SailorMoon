import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const username = ['fqlxd23d112@163.com']
// 强硬要求 ant.design 相同密码
// '21232f297a57a5a743894a0e4a801fc3',
const password = ['1231234'] // admin, ant.design

const login = (options) => {
  // option: url: "/api/auth/login", type: "POST", body: "{"password":"xxx","username":"xxxx"}"
  const body = getBody(options)
  if (!username.includes(body.email) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }

  return builder({
    'role': 0,
    'email': 'fqlxd23d112@163.com',
    'lastLoginTime': 1534837621348,
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3In0.q4yTHo0rFiOAC4Rq7nGDwFX3rgdLeS3QiwpaFLj7pqQ'
  }, '', 200, {})
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}

// 修改密码
const updatePassword = (options) => {
  // console.log('options', options)
  // const body = getBody(options)
  // console.log(body)
  return builder({
    'msg': '密码修改成功',
    'respCode': 1
  }, '', 200, {})
}

const smsCaptcha = () => {
  return builder({ captcha: Mock.mock('@integer(10000, 99999)') })
}

const twofactor = () => {
  return builder({ stepCode: Mock.mock('@integer(0, 1)') })
}

Mock.mock(/\/auth\/login/, 'post', login)
Mock.mock(/\/auth\/logout/, 'post', logout)
Mock.mock(/\/auth\/update-password/, 'post', updatePassword)
Mock.mock(/\/account\/sms/, 'post', smsCaptcha)
Mock.mock(/\/auth\/2step-code/, 'post', twofactor)
