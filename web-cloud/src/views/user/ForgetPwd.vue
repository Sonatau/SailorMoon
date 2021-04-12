<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item
      label="账号"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="['mobile', { rules: [{ required: true, message: '请输入账号' }] }]"
        placeholder="请输入账号"
      />
    </a-form-item>

    <a-form-item
      label="旧密码"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="['oldPassword', { rules: [{ required: true, message: '请输入旧密码' }] }]"
        placeholder="请输入旧密码"
        type="password"
      />
    </a-form-item>

    <a-form-item
      label="新密码"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="['newPassword1', { rules: [{ required: true, message: '请输入新密码' }] }]"
        placeholder="请输入新密码"
        type="password"
      />
    </a-form-item>

    <a-form-item
      label="确认密码"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="['newPassword2', { rules: [{ required: true, message: '请确认密码' }] }]"
        placeholder="请确认密码"
        type="password"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 5 }" style="text-align: center">
      <a-button type="primary" html-type="submit">提交修改</a-button>
      <a-button style="margin-left: 8px" type="danger" @click="cancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { finePhone } from '@/api/manage'

export default {
  name: 'forgetPassword',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          finePhone(values.mobile).then(res => {
            console.log(res.data)
          })
        }
      })
    },
    cancel(e) {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped></style>
