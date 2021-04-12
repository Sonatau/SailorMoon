<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="title">用户字段</div>
      <s-table style="margin-bottom: 24px" row-key="id" :columns="DataColumns" :data="loadUsersData"> </s-table>
    </a-card>

    <a-card :bordered="false">
      <div class="title">机构字段</div>
      <s-table style="margin-bottom: 24px" row-key="id" :columns="DataColumns" :data="loadInstitutionsData"> </s-table>
    </a-card>

    <a-card :bordered="false">
      <div class="title">签到字段</div>
      <s-table style="margin-bottom: 24px" row-key="id" :columns="DataColumns" :data="loadAttendanceData"> </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'

export default {
  components: {
    STable
  },
  data() {
    return {
      DataColumns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '列名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '中文名称',
          dataIndex: 'cname',
          key: 'cname'
        },
        {
          title: '数据类型',
          dataIndex: 'dataType',
          key: 'dataType'
        },
        {
          title: '长度',
          dataIndex: 'length',
          key: 'length'
        },
        {
          title: '备注',
          dataIndex: 'note',
          key: 'note'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadUsersData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                id: 1,
                name: 'id',
                cname: '用户ID',
                dataType: 'Int',
                length: '25',
                note: '主键'
              },
              {
                id: 2,
                name: 'name',
                cname: '姓名',
                dataType: 'nvarchar',
                length: '10',
                note: ''
              },
              {
                id: 3,
                name: 'sex',
                cname: '性别',
                dataType: 'nvarchar',
                length: '3',
                note: ''
              },
              {
                id: 4,
                name: 'email',
                cname: '邮箱',
                dataType: 'nvarchar',
                length: '40',
                note: ''
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 4
          })
        }).then(res => {
          return res
        })
      },

      loadInstitutionsData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                id: 1,
                name: 'id',
                cname: '学校ID',
                dataType: 'Int',
                length: '25',
                note: '主键'
              },
              {
                id: 2,
                name: 'name',
                cname: '学校名称',
                dataType: 'nvarchar',
                length: '25',
                note: ''
              },
              {
                id: 3,
                name: 'college',
                cname: '学院',
                dataType: 'nvarchar',
                length: '25',
                note: ''
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 3
          })
        }).then(res => {
          return res
        })
      },

      loadAttendanceData: () => {
        return new Promise(resolve => {
          resolve({
            data: [
              {
                id: 1,
                name: 'id',
                cname: '签到ID',
                dataType: 'Int',
                length: '25',
                note: '主键'
              },
              {
                id: 2,
                name: 'name',
                cname: '签到名称',
                dataType: 'nvarchar',
                length: '40',
                note: ''
              },
              {
                id: 3,
                name: 'state',
                cname: '状态',
                dataType: 'Int',
                length: '3',
                note: ''
              },
              {
                id: 4,
                name: 'ratio',
                cname: '出勤率',
                dataType: 'nvarchar',
                length: '10',
                note: ''
              }
            ],
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 4
          })
        }).then(res => {
          return res
        })
      }
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
