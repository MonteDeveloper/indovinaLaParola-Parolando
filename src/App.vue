<script>

export default {
  name: "App",
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
    window.addEventListener('dblclick', function (e) {
      e.preventDefault();
    });

  },
  methods: {
  }
}
</script>

<template>
  <div class="container position-relative">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<style lang="scss" scoped></style>
