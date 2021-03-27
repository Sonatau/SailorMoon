<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" :content="$t('')">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <!-- 权限名称 -->
        <a-form-item
          :label="$t('permission.name')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: $t('permission.name.required') }] }]"
            name="name"
            :placeholder="$t('permission.name.placeholder')"
          />
        </a-form-item>

        <!-- 状态选择 -->
        <a-form-item
          :label="$t('permission.status')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="false"
        >
          <a-radio-group v-decorator="['target', { initialValue: 1 }]">
            <a-radio :value="1">{{ $t('permission.status.closed') }}</a-radio>
            <a-radio :value="2">{{ $t('permission.status.using') }}</a-radio>
          </a-radio-group>
          <!-- <a-form-item v-show="form.getFieldValue('target') === 2">
            <a-select mode="multiple">
              <a-select-option value="4">{{ $t('permission.status.A') }}</a-select-option>
              <a-select-option value="5">{{ $t('permission.status.B') }}</a-select-option>
            </a-select>
          </a-form-item> -->
        </a-form-item>

        <!-- 权限管理分配 -->
        <a-form-item
          :label="$t('permission.permission-assignment')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="false"
        >
          <div>
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
        </a-form-item>

        <!-- 用户管理分配 -->
        <a-form-item
          :label="$t('permission.user-assignment')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="false"
        >
          <div>
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">{{ $t('permission.submit') }}</a-button>
          <a-button style="margin-left: 8px">{{ $t('permission.cancel') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
const plainOptions = ['创建用户', '分配权限', '允许分享']
const defaultCheckedList = ['分配权限', '允许分享']

export default {
  name: 'AddPermission',
  data() {
    return {
      form: this.$form.createForm(this),
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
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
