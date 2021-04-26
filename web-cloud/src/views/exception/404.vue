<template>
  <page-header-wrapper title="404">
    <a-row type="flex" justify="center">
      <a-col>
        <img src="~@/assets/404.png" style="height: 500px;" />
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" style="margin-top: 25px">
      <a-button type="primary">返回首页</a-button>
    </a-row>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
