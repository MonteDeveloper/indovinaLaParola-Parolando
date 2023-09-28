<script>
import PageHeader from './components/PageHeader.vue'
import PageMain from './components/PageMain.vue'
import PageFooter from './components/PageFooter.vue'

export default {
  name: "App",
  components: {
    PageHeader,
    PageMain,
    PageFooter
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<template>
  <PageHeader />
  <PageMain />
  <PageFooter />
</template>

<style lang="scss" scoped>
</style>
