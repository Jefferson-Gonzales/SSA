<template>
  <button class="floating-assistant-btn">
    <img width="40" height="40" src="https://img.icons8.com/color/48/message-bot.png" alt="message-bot"/>
  </button>
</template>

<style scoped>
.floating-assistant-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #AAD500;
  color: white;
  font-size: 24px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.floating-assistant-btn:hover {
  background-color: #b9de27;
  transform: scale(1.1);
}
</style>
