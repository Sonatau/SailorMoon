<template>
  <a-modal
    title="新建数据项"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    max: 10,
                    pattern: '^[\u4e00-\u9fa5]{0,}$',
                    message: '请输入10字以内的汉字描述！'
                  }
                ]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="取值">
          <a-input
            v-decorator="[
              'value',
              {
                rules: [
                  { required: true, min: 1, max: 3, pattern: '^[0-9]*[1-9][0-9]*$', message: '请输入1-3位有效的取值！' }
                ]
              }
            ]"
          />
        </a-form-item>

        <a-form-item
          label="默认值"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="true"
        >
          <a-radio-group v-decorator="['isDefault', { initialValue: 0 }]">
            <a-radio :value="0">非默认</a-radio>
            <a-radio :value="1">默认</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'value', 'isDefault']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created() {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
