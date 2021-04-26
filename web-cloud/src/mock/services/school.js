import Mock from 'mockjs2'
import { builder } from '../util'

// 获取权限列表
const getSchoolList = (options) => {
    // 传递的是参数 没有body体
    return builder({
        'respCode': 1,
        'data': [
            {
                'id': 1,
                'name': '福州大学',
                'children': [
                    {
                        'id': 10,
                        'name': '数学与计算机科学',
                        'parentid': 1,
                        'children': [
                            {
                                'id': 101,
                                'name': '人工智能',
                                'parentid': 10
                            },
                            {
                                'id': 102,
                                'name': '软件工程',
                                'parentid': 10
                            }
                        ]
                    },
                    {
                        'id': 11,
                        'name': '经管学院',
                        'parentid': 1
                    },
                    {
                        'id': 12,
                        'name': '自动化学院',
                        'parentid': 1
                    }
                ]
            },
            {
                'id': 2,
                'name': '厦门大学',
                'children': [
                    {
                        'id': 20,
                        'parentid': 2,
                        'name': '计算机学院',
                        'children': [
                            {
                                'id': 201,
                                'parentid': 20,
                                'name': '人工智能'
                            },
                            {
                                'id': 202,
                                'parentid': 20,
                                'name': '计算机科学与技术'
                            }
                        ]
                    },
                    {
                        'id': 21,
                        'name': '国际关系学院',
                        'parentid': 2
                    },
                    {
                        'id': 22,
                        'parentid': 2,
                        'name': '医学院学院'
                    }
                ]
            },
            {
                'id': 3,
                'name': '北京大学'
            }
        ]
    }, '', 200, {})
}

// 添加学校/学院/专业
const addSchool = (options) => {
    return builder({
        'msg': '创建成功',
        'respCode': 1
    }, '', 200, {})
}

// 修改学校/学院/专业
const updateSchool = (options) => {
    return builder({
        'msg': '修改成功',
        'respCode': 1
    }, '', 200, {})
}

// 删除
const deleteSchool = (options) => {
    return builder({
        'msg': '删除成功',
        'respCode': 1
    }, '', 200, {})
}

Mock.mock(/\/school\/getSchoolList/, 'get', getSchoolList)
Mock.mock(/\/school\/addSchool/, 'post', addSchool)
Mock.mock(/\/school\/updateSchool/, 'post', updateSchool)
Mock.mock(/\/school\/deleteSchool/, 'del', deleteSchool)
