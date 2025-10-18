<template>
  <div>
    <HeaderNav v-if="!$route.meta.hideNavbar" :cartItemsCount="cartItemCount" />

    <router-view/>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav.vue'

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      cartItemCount: 1
    }
  }
}
</script>

<style>
#root-reset, html, body, #app {
  height: 100%;
  margin: 0;
}
#root-reset { display: block; }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
