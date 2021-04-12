import Mock from 'mockjs2'
import { builder, getBody } from '../util'

// 获取权限列表
const getPerList = (options) => {
    const body = getBody(options)
    console.log(body)
    return builder({
        'total': 3,
        'respCode': 1,
        'list': [
            {
                'id': 1,
                'name': 'user1',
                'roleDescribe': '123123',
                'state': 1
            },
            {
                'id': 2,
                'name': 'user2',
                'roleDescribe': '会撒谎会撒谎',
                'state': 0
            },
            {
                'id': 3,
                'name': 'user3',
                'roleDescribe': '带上发哈斯',
                'state': 1
            }
        ]
    }, '', 200, {})
}

// 创建/更新权限
const upsertPer = (options) => {
    return builder({
        'msg': '创建成功',
        'respCode': 1
    }, '', 200, {})
}

const deletePer = (options) => {
    return builder({
        'msg': '删除角色成功',
        'respCode': 1
    }, '', 200, {})
}

Mock.mock(/\/permission\/getPerList/, 'get', getPerList)
Mock.mock(/\/permission\/upsertPer/, 'get', upsertPer)
Mock.mock(/\/permission\/deletePer/, 'get', deletePer)
