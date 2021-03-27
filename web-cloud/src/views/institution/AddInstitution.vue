<template>
  <page-header-wrapper>
    <a-card class="card" title="基本信息" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="trigger => trigger.parentNode"
        >
          <template slot="content">
            <li
              v-for="item in errors"
              :key="item.key"
              @click="scrollToField(item.key)"
              class="antd-pro-pages-forms-style-errorListItem"
            >
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import RepositoryForm from './RepositoryForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'

const fieldLabels = {
  experience: '签到经验',
  activity: '活动经验'
}

export default {
  name: 'Setting',
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    RepositoryForm
  },
  data() {
    return {
      loading: false,
      memberLoading: false,

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
    },

    // 最终全页面提交
    validate() {
      const {
        $refs: { repository },
        $notification
      } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm])
        .then(values => {
          $notification['error']({
            message: 'Received values of form:',
            description: JSON.stringify(values)
          })
        })
        .catch(() => {
          const errors = Object.assign({}, repository.form.getFieldsError())
          const tmp = { ...errors }
          this.errorList(tmp)
        })
    },
    errorList(errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter(key => errors[key])
        .map(key => ({
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }))
    },
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
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
