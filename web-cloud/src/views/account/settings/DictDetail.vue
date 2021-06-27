<template>
  <page-header-wrapper>
    <a-card class="card" title="系统参数" :bordered="false">
      <a-form :form="form" style="margin: 0px auto 1px;" @submit="handleSubmit">
        <p style="font-size: 16px; font-weight: bold">数据字典</p>
        <a-form-item label="中文标识" :labelCol="labelCol" :wrapperCol="wrapperCol" compact>
          <a-input
            style="width: 60%"
            v-decorator="[
              'znlabel',
              {
                initialValue: basicInfo.znlabel,
                rules: [
                  {
                    required: true,
                    min: 2,
                    max: 10,
                    message: '请输入2-10个汉字的描述！',
                    pattern: '^[\u4e00-\u9fa5]{0,}$'
                  }
                ],
                validateTrigger: 'blur'
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="英文标识" :labelCol="labelCol" :wrapperCol="wrapperCol" compact>
          <a-input
            style="width: 60%; margin-right: 10px"
            v-decorator="[
              'enlabel',
              {
                initialValue: basicInfo.enlabel,
                rules: [{ required: true, min: 3, max: 20, message: '请输入3-20个字母描述！', pattern: '^[A-Za-z]+$' }],
                validateTrigger: 'blur'
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" compact>
          <a-textarea
            style="width: 60%; margin-right: 10px"
            v-decorator="['description', { initialValue: basicInfo.description }]"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
        <p style="font-size: 16px; font-weight: bold">数据项</p>
        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
          <template v-for="(col, i) in ['name', 'value', 'isDefault']" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @blur="loseBlur(record)"
              @change="e => handleChange(e.target.value, record.name, col)"
            />
            <template v-else>{{ text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="up(record)">上移</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
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
          新增数据项
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
import { addDictionary, deleteDictDetail, editDict, getDictDetail } from '@/api/manage'

export default {
  name: 'DictDetail',
  components: {},
  inject: ['reload'],
  data() {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      loading: false,
      memberLoading: false,
      basicInfo: {
        id: '',
        znlabel: '',
        enlabel: '',
        description: ''
      },
      form: this.$form.createForm(this),
      // table
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '取值',
          dataIndex: 'value',
          key: 'value',
          width: '20%',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '默认值',
          dataIndex: 'isDefault',
          key: 'isDefault',
          width: '40%',
          scopedSlots: { customRender: 'isDefault' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      newItemID: [],
      ableCommit: false,
      errors: []
    }
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query) {
      this.basicInfo = this.$route.query
      const requestParameters = {
        page: 1,
        id: this.basicInfo.id
      }
      getDictDetail(requestParameters).then(res => {
        this.data = res.data.list
        this.data.forEach(item => {
          item.isDefault = item.isDefault == 1 ? '是' : '否'
          item.isNew = false
          item.editable = false
        })
      })
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values, this.data, this.basicInfo)
        console.log('the user is trying to edit the parameter')
        if (!err) {
          this.data.forEach(item => {
            item.isDefault = item.isDefault == '是' ? 1 : 0
            item['type'] = 'radio'
          })
          var dictionary = Object.assign({}, values, { details: this.data })
          // console.log(dictionary)
          // 新建
          if (!this.basicInfo.znlabel) {
            console.log(dictionary)
            addDictionary(dictionary)
              .then(res => {
                if (res.respCode > 0) {
                  this.$message.success(res.msg)
                  this.$router.push({ path: '/account/settings/DataDictionary' })
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(err => {
                this.$message.error(err.msg)
              })
          } else {
            dictionary['id'] = this.basicInfo.id
            editDict(dictionary)
              .then(res => {
                if (res.respCode > 0) {
                  this.$message.success(res.msg)
                  this.$router.push({ path: '/account/settings/DataDictionary' })
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(err => {
                this.$message.error(err.msg)
              })
          }
        }
      })
    },
    handleCancel() {
      this.$router.push({ path: '/account/settings/DataDictionary' })
    },
    newMember() {
      const length = this.data.length
      const newItem = {
        name: '',
        value: length === 0 ? '0' : (parseInt(this.data[length - 1].value) + 1).toString(),
        isDefault: '否',
        editable: true,
        isNew: true
      }
      this.data.push(newItem)
    },

    // 由于名称是唯一的，因为根据名称进行移除
    remove(record) {
      console.log(record)
      // 有id说明此数据项存在于数据库中
      if (record.id) {
        deleteDictDetail({ id: record.id })
          .then(res => {
            this.$message.info(res.msg)
            this.reload()
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      } else {
        const newData = this.data.filter(item => item.name !== record.name)
        this.data = newData
      }
    },

    // 失焦后 使用hash判断是否存在name或者value的重复
    loseBlur(record) {
      var hash = {}
      for (var i in this.data) {
        if (hash[this.data[i].name] || hash[this.data[i].value]) {
          this.$message.error('名称或取值存在重复！')
          return
        }
        hash[this.data[i].name] = true
        hash[this.data[i].value] = true
      }
      this.ableCommit = true
    },

    // 保存修改/新增的数据项
    saveRow(record) {
      this.memberLoading = true
      const { name, value, isDefault } = record
      if (!name || !value || !isDefault || !this.ableCommit) {
        this.memberLoading = false
        this.$message.error('请填写完整信息。')
        return
      }
      // 自动抢占默认值
      if (record.isDefault === '是') {
        const target = this.data.find(item => item.isDefault === record.isDefault)
        if (target.name !== record.name) {
          target.isDefault = '否'
        }
      }
      // 模拟网络请求、卡顿 800ms
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.find(item => item.name === record.name)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },

    // 编辑
    toggle(record) {
      const target = this.data.find(item => item.name === record.name)
      target._originalData = { ...target }
      target.editable = !target.editable
      this.data = this.data
    },
    cancel(record) {
      const target = this.data.find(item => item.name === record.name)
      Object.keys(target).forEach(id => {
        target[id] = target._originalData[id]
      })
      target._originalData = undefined
    },
    handleChange(value, name, column) {
      const newData = [...this.data]
      const target = newData.find(item => name === item.name)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },

    // 上移
    up(record) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].name == record.name) {
          this.data.splice(i, 1)
          this.data.splice(0, 0, record)
        }
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
