<template>
  <a-modal
    title="新建数据字典"
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
        <a-form-item label="中文标识">
          <a-input
            v-decorator="[
              'znlabel',
              {
                rules: [
                  {
                    required: true,
                    min: 2,
                    max: 10,
                    message: '请输入2-10个汉字的描述！',
                    pattern: '^[\u4e00-\u9fa5]{0,}$'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="英文标识">
          <a-input
            v-decorator="[
              'enlabel',
              {
                rules: [{ required: true, min: 3, max: 20, message: '请输入3-20个字母描述！', pattern: '^[A-Za-z]+$' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="说明">
          <a-textarea v-decorator="['description']" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id', 'znlabel', 'enlabel']

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
