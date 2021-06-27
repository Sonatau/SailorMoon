<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-descriptions title="数据信息">
          <a-descriptions-item label="ID">{{ basicInfo.id }}</a-descriptions-item>
          <a-descriptions-item label="角色名称">{{ basicInfo.name }}</a-descriptions-item>
          <a-descriptions-item label="说明">{{ basicInfo.roleDescribe }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px" />
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-button type="primary" icon="plus" @click="handleAdd">新建权限</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        :showPagination="false"
      >
        <span slot="id" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="permissionName" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <dict-detail
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { addRolePower, deleteRolePower, getRolePower } from '@/api/manage'

import CreateDictDetailForm from './modules/CreateDictDetailForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '权限名称',
    dataIndex: 'permissionName',
    scopedSlots: { customRender: 'permissionName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'RoleList',
  components: {
    STable,
    Ellipsis,
    DictDetail: CreateDictDetailForm
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      basicInfo: this.$route.query,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, { page: parameter.pageNo })
        console.log('loadData request parameters:', requestParameters)
        return getRolePower({ roleId: this.basicInfo.id }).then(res => {
          return { data: res.data.list }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {},
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd() {
      this.mdl = null
      this.visible = true
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
          } else {
            var rolePowerInfo = {
              roleId: this.basicInfo.id,
              powerIds: ''
            }
            for (var i in values.power) {
              rolePowerInfo.powerIds = rolePowerInfo.powerIds + values.power[i].toString() + ','
            }
            // 新增
            addRolePower(rolePowerInfo)
              .then(res => {
                if (res.respCode > 0) {
                  this.visible = false
                  this.confirmLoading = false
                  // 重置表单数据
                  form.resetFields()
                  // 刷新表格
                  this.$refs.table.refresh()

                  this.$message.success(res.msg)
                } else {
                  this.confirmLoading = false
                  this.$message.error(res.msg)
                }
              })
              .catch(err => {
                this.$message.error(err.msg)
              })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDelete(record) {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      deleteRolePower({ ids: record.id })
        .then(res => {
          if (res.respCode > 0) {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.success(res.msg)
          } else {
            this.confirmLoading = false
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.confirmLoading = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    PowerEdit(record) {
      this.$router.push({ path: '/UserRole/RolePower', query: record })
    }
  }
}
</script>
