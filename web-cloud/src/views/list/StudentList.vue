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
        <span slot="telephone" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="email" slot-scope="text">
          <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <!-- <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      /> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { addRole, editRole, getRoleStudent } from '@/api/manage'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '电话',
    dataIndex: 'telephone',
    scopedSlots: { customRender: 'telephone' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

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
        return getRoleStudent(requestParameters).then(res => {
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
              .cathch(err => {
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
    handleDelete(record) {},
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
