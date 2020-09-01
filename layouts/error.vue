<template>
  <v-app dark>
    <h1 v-show="error.statusCode === 404">
      <nuxt-link to="/404">404</nuxt-link>
    </h1>
    <h1 v-show="error.statusCode !== 404">
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  mounted() {
    console.log("错误", this.error);
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
