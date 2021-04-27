<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="权限名称">
                <a-input v-model="queryParam.name" placeholder="按名称查找" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="table-operator">
                <a-button type="default" @click="handleSearchByName">查找</a-button>
                <a-button type="primary" icon="plus" @click="handleAdd">添加权限</a-button>
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
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="roleDescribe" slot-scope="text">
          <span>{{ text }}</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)">删除</a>
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { getPerList, deletePer } from '@/api/permission'
import CreateForm from './modules/CreateForm'
// import { mapGetters } from 'vuex'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '权限名称',
    dataIndex: 'name'
  },
  {
    title: '使用状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '说明',
    dataIndex: 'roleDescribe',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '可用'
  }
}

export default {
  name: 'PermissionList',
  components: {
    STable,
    CreateForm
  },
  data() {
    this.columns = columns
    return {
      pagination: false,
      curPage: 1,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // requestParameters是所有查询条件
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        // console.log('loadData request parameters:', requestParameters)
        return getPerList(this.curPage, requestParameters.name).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
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
      this.$router.push({ name: 'AddPermission' })
    },

    // 编辑
    handleEdit(record) {
      const arr = JSON.stringify(record)
      this.$router.push({
        name: 'AddPermission',
        params: {
          record: encodeURIComponent(arr)
        }
      })
    },

    // 删除
    handleDelete(record) {
      deletePer(record.id)
        .then(res => {
          this.$message.success('删除成功！')
          this.$refs.table.refresh()
        })
        .catch(err => {
          this.$message.error('操作失败', err)
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
