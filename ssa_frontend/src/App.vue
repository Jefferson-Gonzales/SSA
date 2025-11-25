<template>
  <div>
    <HeaderNav v-if="!$route.meta.hideNavbar" :cartItemsCount="cartItemCount" />
    <ProfilePrompt />


    <router-view/>
    <FloatingAssistantButton :is-open="isChatOpen" @toggle-chat="toggleChat"/>
    <ChatBotView v-if="isChatOpen" @close-chat="closeChat"/>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav.vue'
import FloatingAssistantButton from './components/FloatingAssistantButton.vue';
import ChatBotView from './views/ChatBotView.vue';
import ProfilePrompt from '@/components/ProfilePrompt.vue';


export default {
  components: {
    HeaderNav,
    FloatingAssistantButton,
    ChatBotView,
    ProfilePrompt
  },
  data() {
    return {
      cartItemCount: 1,
      isChatOpen: false
    }
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
    },
    closeChat() {
      this.isChatOpen = false;
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
