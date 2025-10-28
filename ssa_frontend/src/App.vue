<template>
  <div>
    <HeaderNav v-if="!$route.meta.hideNavbar" :cartItemsCount="cartItemCount" />

    <router-view/>
    <FloatingAssistantButton v-if="!isChatOpen" @open-chat="isChatOpen = true"/>
    <ChatBot v-if="isChatOpen" @close-chat="isChatOpen = false"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav.vue'
import FloatingAssistantButton from './components/FloatingAssistantButton.vue';
import ChatBot from './views/ChatBot.vue';


export default {
  components: {
    HeaderNav,
    FloatingAssistantButton,
    ChatBot
  },
  data() {
    return {
      cartItemCount: 1,
      isChatOpen: false
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
