<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  .v-enter{
    opacity: 0;
  }
  .v-enter-active{
    transition: 0.5s;
  }
  .v-enter-to{
    opacity: 1;
  }
  .v-leave{
    opacity: 1;
  }
  .v-leave-to{
    opacity:0;
  }
  .v-leave-active{
    transition: 0.5s;
  }
</style>
