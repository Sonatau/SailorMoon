<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :span="12">
        <a-form-item label="签到名称">
          <a-input
            placeholder="二十字以内"
            v-decorator="['name', { rules: [{ required: true, message: '请输入签到名称', whitespace: true }] }]"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="发起人">
          <a-select
            placeholder="请选择发起人"
            v-decorator="['approver', { rules: [{ required: true, message: '请选择发起人' }] }]"
          >
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
        <a-form-item label="开始时间">
          <a-time-picker
            style="width: 100%"
            v-decorator="['start', { rules: [{ required: true, message: '请选择提醒时间' }] }]"
          />
        </a-form-item>
      </a-col>

      <a-col :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
        <a-form-item label="结束时间">
          <a-time-picker
            style="width: 100%"
            v-decorator="['end', { rules: [{ required: true, message: '请选择提醒时间' }] }]"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="所属课程">
          <a-select
            placeholder="请选择课程"
            v-decorator="['course', { rules: [{ required: true, message: '请选择课程' }] }]"
          >
            <a-select-option value="智能技术">智能技术</a-select-option>
            <a-select-option value="强化学习">强化学习</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
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
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate(rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback(new Error('需要以 user- 开头'))
      }
      callback()
    }
  }
}
</script>

<style scoped></style>
