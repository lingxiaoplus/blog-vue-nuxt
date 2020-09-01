<template>
  <transition mode="out-in">
  <router-view/>
  </transition>
</template>

<script>
  export default {
    name: 'App',
    created() {
      this.$router.push("front/articleList");
    }
  }
</script>

<style>

</style>
