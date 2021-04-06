<template>
  <a-result status="600" title="自定义界面" sub-title="Sorry, the server is reporting an error.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception600',
  methods: {
    toHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
