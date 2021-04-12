<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" :content="$t('')">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <!-- 权限名称 -->
        <a-form-item
          label="权限名称"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入权限名称' }] }]"
            name="name"
            placeholder="二十字以内"
          />
        </a-form-item>

        <!-- 状态选择 -->
        <a-form-item
          label="状态"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="true"
        >
          <a-radio-group v-decorator="['state', { initialValue: 1 }]">
            <a-radio :value="0">禁用</a-radio>
            <a-radio :value="1">可用</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 权限说明 -->
        <a-form-item
          label="说明"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-textarea
            v-decorator="['roleDescribe', { rules: [{ required: false, message: '请输入权限名称' }] }]"
            name="roleDescribe"
            placeholder="可补充说明权限信息"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

        <!-- 权限管理分配 -->
        <a-form-item
          label="授权分配"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="true"
        >
          <div>
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px" @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { upsertPer } from '@/api/permission'
const plainOptions = ['权限管理', '用户管理', '考勤管理', '机构管理']
const defaultCheckedList = ['权限管理']
export default {
  name: 'AddPermission',
  data() {
    return {
      checkedList: defaultCheckedList,
      indeterminate: false,
      checkAll: false,
      plainOptions
    }
  },
  created() {
    this.form = this.$form.createForm(this)
    if (this.$route.params.record) {
      const record = JSON.parse(decodeURIComponent(this.$route.params.record))
      console.log(record)
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const requestParameters = Object.assign({}, values)
          requestParameters['role'] = this.checkedList
          if (requestParameters['role'].length !== 0) {
            upsertPer(requestParameters)
              .then(res => {
                this.$message.success(res.result.msg)
                this.$router.push({ name: 'PermissionList' })
              })
              .catch(err => {
                this.$message.error('新建失败', err)
              })
          } else {
            this.$message.error('至少选择一个权限进行分配')
          }
        }
      })
    },

    // 取消新建
    handleCancel() {
      this.$router.push({ name: 'PermissionList' })
    },

    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    }
  }
}
</script>
