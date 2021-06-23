<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-item>
            </a-col>

            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)" style="margin-right: 10px">查询</a-button>
                <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
              </span>
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
        <span slot="name" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="state" slot-scope="text">
          <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
        </span>
        <span slot="roleDescribe" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click="PowerEdit(record)">权限设置</a>
          </template>
        </span>
      </s-table>

      <create-form
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
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { addRole, deleteRole, editRole, getListRole } from '@/api/manage'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '描述',
    dataIndex: 'roleDescribe',
    scopedSlots: { customRender: 'roleDescribe' }
  },
  {
    title: '使用状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

const stateMap = {
  0: {
    state: 'default',
    text: '关闭'
  },
  1: {
    state: 'processing',
    text: '运行中'
  }
}

export default {
  name: 'RoleList',
  components: {
    STable,
    Ellipsis,
    CreateForm
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, { page: parameter.pageNo })
        console.log('loadData request parameters:', requestParameters)
        return getListRole(requestParameters).then(res => {
          return { data: res.data.list }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    stateFilter(type) {
      return stateMap[type].text
    },
    stateTypeFilter(type) {
      return stateMap[type].state
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
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            editRole(values)
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
          } else {
            // 新增
            addRole(values)
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
      deleteRole({ id: record.id })
        .then(res => {
          if (res.respCode > 0) {
            const form = this.$refs.createModal.form
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    PowerEdit(record) {
      this.$router.push({ path: '/UserRole/RolePower', query: record })
    }
  }
}
</script>
