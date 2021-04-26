<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper title="添加机构" content="您可以选择添加学校、学院或专业...">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-tabs :default-active-key="active_key" @change="callback">
        <a-tab-pane key="1" tab="添加学校">
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item
              label="学校名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入学校名称' }]
                  }
                ]"
                name="name"
                placeholder="二十字以内"
              />
            </a-form-item>

            <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
              <a-button htmlType="submit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px" @click="handleCancel">取消</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="添加学院" force-render>
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item> </a-form-item>
            <a-form-item
              label="学院名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入学校名称' }]
                  }
                ]"
                name="name"
                placeholder="二十字以内"
              />
            </a-form-item>

            <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
              <a-button htmlType="submit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px" @click="handleCancel">取消</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="3" tab="添加专业">
          Content of Tab Pane 3
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'AddInstitution',
  data() {
    return {
      active_key: '1',
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        // this.fetchData()
      },
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      { immediate: true }
    )
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
        }
      })
    },

    // 取消新建
    handleCancel() {
      this.$router.push({ name: 'InstitutionList' })
    },

    callback(key) {
      console.log(key)
    }
  }
}
</script>
