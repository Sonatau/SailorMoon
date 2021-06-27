<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical" :form="form" @submit="handleSubmit">
          <a-form-item label="旧密码">
            <a-input
              placeholder="请输入旧密码"
              type="password"
              v-decorator="[
                'oldPassword',
                { rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: 'blur' }
              ]"
            />
          </a-form-item>

          <a-form-item label="新密码">
            <a-input
              placeholder="请输入新密码"
              type="password"
              v-decorator="[
                'newPassword1',
                { rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur' }
              ]"
            />
          </a-form-item>

          <a-form-item label="确认密码">
            <a-input
              placeholder="再次输入密码"
              type="password"
              v-decorator="[
                'newPassword2',
                { rules: [{ required: true, message: '请确认密码' }], validateTrigger: 'blur' }
              ]"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit">修改密码</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import store from '../../../store'
import { updatePassword } from '@/api/manage'
// 记得加括号 才会被认为是一个接口
export default {
  data() {
    return {
      // cropper
      preview: {},
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword1 !== values.newPassword2) {
            this.$message.error('两次密码不一致！')
          } else {
            console.log(store.getters.token)
            updatePassword(values)
              .then(res => {
                this.$router.push({ path: '/' })
                // 延迟 1 秒显示欢迎信息
                setTimeout(() => {
                  this.$notification.success({
                    message: '恭喜',
                    description: res.result.msg
                  })
                }, 1000)
              })
              .catch(err => {
                this.$message.error('修改失败', err.code)
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
