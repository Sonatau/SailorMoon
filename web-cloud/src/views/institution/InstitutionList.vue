<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="查找">
                <a-input v-model="queryParam.name" placeholder="按学校/学院/专业名称查找" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="table-operator">
                <a-button type="default" @click="handleSearchByName">查找</a-button>
                <a-button type="primary" icon="plus" @click="handleAdd">添加机构</a-button>
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
        <span slot="id" slot-scope="text">
          <ellipsis :length="7" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="name" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
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
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { deleteSchoolList, editSchool, getSchoolList } from '@/api/manage'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '单位名称',
    dataIndex: 'name'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'InstitutionList',
  components: {
    STable,
    CreateForm
  },
  data() {
    this.columns = columns
    return {
      pagination: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      curPage: 1,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: ''
      },
      schoolList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // requestParameters是所有查询条件
        // console.log('loadData request parameters:', requestParameters)
        return getSchoolList({ page: parameter.pageNo, parentId: 0 }).then(res => {
          this.schoolList = res.data.list
          for (var i in this.schoolList) {
            var item1 = this.schoolList[i] // 学校
            item1['parentId'] = 0
            var id1 = item1.id // 福州大学的id
            for (var j in item1.children) {
              var item2 = item1.children[j] // 学院
              item2['parentId'] = id1
              var id2 = item2.id
              for (var k in item2.children) {
                var item3 = item2.children[k]
                item3['parentId'] = id2
              }
            }
          }
          console.log(this.schoolList)
          return { data: res.data.list }
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
      this.$router.push({ path: '/institution/AddInstitution', query: this.schoolList })
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
          editSchool(values)
            .then(res => {
              if (res.respCode > 0) {
                this.visible = false
                this.confirmLoading = false
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
      })
    },
    handleCancel() {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    // 删除
    handleDelete(record) {
      this.confirmLoading = true
      deleteSchoolList({ ids: record.id })
        .then(res => {
          if (res.respCode > 0) {
            this.confirmLoading = false
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
