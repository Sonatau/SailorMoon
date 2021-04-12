<template>
  <page-header-wrapper>
    <a-card class="card" title="分值设置" :bordered="false">
      <a-form :form="form" style="max-width: 700px; margin: 20px auto 40px;" @submit="handleSubmit">
        <a-form-item label="签到经验值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="2"
            v-decorator="[
              'score1',
              {
                initialValue: '2',
                rules: [{ required: true, message: '请输入签到经验值' }],
                validateTrigger: 'blur'
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="活动经验值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="2"
            v-decorator="[
              'score2',
              { initialValue: '2', rules: [{ required: true, message: '请输入活动经验值' }], validateTrigger: 'blur' }
            ]"
          />
        </a-form-item>

        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
          <template v-for="(col, i) in ['level', 'ratio']" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{ text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(record.key)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="newMember"
        >
          新增等级
        </a-button>
        <div style="float: right; margin-top: 30px;">
          <a-button htmlType="submit" type="primary" style="margin-right: 15px">
            提交
          </a-button>
          <a-button type="default" style="float: right" @click="handleCancel">
            取消
          </a-button>
        </div>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from './RepositoryForm'

export default {
  name: 'Setting',
  components: {
    RepositoryForm
  },
  data() {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      loading: false,
      memberLoading: false,
      form: this.$form.createForm(this),
      // table
      columns: [
        {
          title: '出勤等级',
          dataIndex: 'level',
          key: 'level',
          width: '30%',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '出勤率',
          dataIndex: 'ratio',
          key: 'ratio',
          width: '20%',
          scopedSlots: { customRender: 'ratio' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          level: 'LV1',
          ratio: '20'
        },
        {
          key: '2',
          level: 'LV2',
          ratio: '40'
        },
        {
          key: '3',
          level: 'LV3',
          ratio: '60'
        }
      ],

      errors: []
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.$message.success('提交成功')
          this.$router.push({ name: 'AttendanceList' })
        }
      })
    },
    handleCancel() {
      this.$router.push({ name: 'AttendanceList' })
    },
    newMember() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        level: '',
        ratio: '',
        editable: true,
        isNew: true
      })
    },
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(record) {
      this.memberLoading = true
      const { key, level, ratio } = record
      if (!level || !ratio) {
        this.memberLoading = false
        this.$message.error('请填写完整等级信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.find(item => item.key === key)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },
    toggle(key) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).find(item => item.key === key)
    },
    cancel(key) {
      const target = this.data.find(item => item.key === key)
      Object.keys(target).forEach(key => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
