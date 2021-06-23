/* eslint-disable vue/valid-v-for */
<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper title="添加机构" content="您可以选择添加学校、学院或专业...">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-tabs :default-active-key="active_key" @change="callback">
        <!-- 添加学校 -->
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
                placeholder="二十字以内"
              />
            </a-form-item>

            <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
              <a-button htmlType="submit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px" @click="handleCancel">取消</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 添加学院 -->
        <a-tab-pane key="2" tab="添加学院" force-render>
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item
              label="学校名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-select
                style="width: 120px"
                @change="handleChange"
                v-decorator="[
                  'parentId',
                  {
                    rules: [{ required: true, message: '请选择学校' }]
                  }
                ]"
              >
                <a-select-option v-for="item in schoolList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="学院名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="[
                  'name',
                  {
                    // rules: [{ required: true, message: '请输入学院名称' }]
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

        <!-- 添加专业 -->
        <a-tab-pane key="3" tab="添加专业" force-render>
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item
              label="学校名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-select
                style="width: 120px"
                @change="handleChange"
                v-decorator="[
                  'schoolId',
                  {
                    // rules: [{ required: true, message: '请选择学校' }]
                  }
                ]"
              >
                <a-select-option v-for="item in schoolList" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="学院名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-select
                style="width: 120px"
                v-decorator="[
                  'parentId',
                  {
                    //rules: [{ required: true, message: '请选择学院' }]
                  }
                ]"
              >
                <a-select-option v-for="item in collegies" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="专业名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入专业名称' }]
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
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { addSchool } from '@/api/manage'
export default {
  name: 'AddInstitution',
  data() {
    return {
      active_key: '1',
      current_key: '1',
      allInfo: [],
      schoolList: [],
      CollegeList: {},
      collegies: [],
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.allInfo = this.$route.query
    console.log(this.allInfo)
    for (var i in this.allInfo) {
      var schoolName = this.allInfo[i].name
      var schoolId = this.allInfo[i].id
      this.CollegeList[schoolId] = []
      this.schoolList.push({ label: schoolName, value: this.allInfo[i].id })
      for (var j in this.allInfo[i].children) {
        this.CollegeList[schoolId].push({
          label: this.allInfo[i].children[j].name,
          value: this.allInfo[i].children[j].id
        })
      }
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          if (this.current_key == '1') {
            values['parentId'] = 0
          }
          addSchool(values)
            .then(res => {
              if (res.respCode > 0) {
                this.$router.push({ path: '/institution/InstitutionList' })
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        }
      })
    },

    // 取消新建
    handleCancel() {
      this.$router.push({ name: 'InstitutionList' })
    },

    callback(key) {
      this.current_key = key
    },

    handleChange(key) {
      this.collegies = this.CollegeList[key]
    }
  }
}
</script>
