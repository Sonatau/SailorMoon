<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="参数名称">
                <a-input v-model="queryParam.name" placeholder="按名称查找" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="table-operator">
                <a-button type="default" @click="handleSearchByName">查找</a-button>
                <a-button type="primary" icon="plus" @click="handleAdd">添加参数</a-button>
              </div>
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
        :showPagination="pagination"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleDetail(record)">详情</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <a-row style="margin-top: 25px">
        <div style="float: right">
          第 {{ curPage }} 页
          <a-button style="default; margin-right: 10px; margin-left: 10px" value="small" @click="lastPage">
            <a-icon type="left" />上一页
          </a-button>
          <a-button style="default" value="small" @click="nextPage">下一页<a-icon type="right"/></a-button>
        </div>
      </a-row>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
        @blur="handleLoseBlur"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CreateForm'
import { addSystemParam, deleteSystemParam, getSystemParam, editSystemParam } from '@/api/manage'
// import { getAllDict, addDict, editDict, delDict, queryDict } from '@/api/manage'
// import { mapGetters } from 'vuex'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '关键字',
    dataIndex: 'keyWord'
  },
  {
    title: '取值',
    dataIndex: 'value'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const systemParams = {
  data: []
}

export default {
  name: 'DataDictionary',
  components: {
    STable,
    CreateForm
  },
  data() {
    this.columns = columns
    return {
      pagination: false,
      allDict: [],
      curPage: 1,
      // 高级搜索 展开/关闭
      advanced: false,
      confirmLoading: false,
      mdl: null,
      // create model
      visible: false,
      // 查询参数
      queryParam: {
        name: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSystemParam({ page: parameter.pageNo }).then(res => {
          console.log(parameter.pageNo)
          systemParams.data = res.data.list
          systemParams.respCode = res.data.respCode
          return systemParams
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    // getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    // 添加
    handleAdd() {
      this.mdl = null
      this.visible = true
    },
    handleLoseBlur() {
      console.log('111')
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            // 修改系统参数
            editSystemParam(values)
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
                  this.$message.error(res.msg)
                  this.confirmLoading = false
                }
              })
              .catch(err => {
                this.$error.err(err.msg)
              })
          } else {
            // 添加系统参数
            addSystemParam(values)
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
                  this.$message.error(res.msg)
                  this.confirmLoading = false
                }
              })
              .catch(err => {
                this.$error.err(err.msg)
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

    // 修改
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
    },

    // 查看详情
    handleDetail(record) {
      this.$router.push({
        path: '/account/settings/DictDetail',
        query: record
      })
    },

    // 删除
    handleDelete(id) {
      const form = this.$refs.createModal.form
      deleteSystemParam({ id: id })
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
            this.$message.error(res.msg)
            this.confirmLoading = false
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },

    handleSearchByName() {
      // 查找
      this.$refs.table.refresh()
    },
    // 上一页
    lastPage() {
      if (this.curPage !== 1) {
        this.curPage--
        this.$refs.table.refresh()
      }
    },

    // 下一页
    nextPage() {
      this.curPage++
      this.$refs.table.refresh()
    },

    // 选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      // console.log(this.selectedRowKeys.length)
    }
  }
}
</script>
