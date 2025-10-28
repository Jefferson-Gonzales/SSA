<template>
  <div class="chat-wrapper" role="dialog" aria-label="Asistente de compras">
    <div class="chat-container">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-content">
        <img width="48" height="48" src="https://img.icons8.com/parakeet/48/chatbot.png" alt="chatbot"/>
        <div class="header-info">
          <h3 class="header-title">Asistente de compras</h3>
          <span class="status-badge">Online</span>
        </div>
      </div>
      <button type="button" class="close-btn" @click="closeChat" aria-label="Cerrar chat">×</button>
    </div>

    <!-- Messages Container -->
    <div class="messages-container">
      <!-- Assistant Message -->
      <div class="message-group assistant">
        <img width="48" height="48" src="https://img.icons8.com/parakeet/48/chatbot.png" alt="Assistant" class="message-avatar">
        <div class="message-bubble assistant-message">
          <p>Hola, soy tu asistente de compras. ¿En qué puedo ayudarte hoy?</p>
        </div>
      </div>

      <!-- User Message -->
      <div class="message-group user">
        <div class="message-bubble user-message">
          <p>Estoy buscando un nuevo par de zapatillas para correr.</p>
        </div>
        <img width="100" height="100" src="https://img.icons8.com/stickers/100/user-male-circle.png" alt="User" class="message-avatar">
      </div>

      <!-- Assistant Message -->
      <div class="message-group assistant">
        <img width="48" height="48" src="https://img.icons8.com/parakeet/48/chatbot.png" alt="Assistant" class="message-avatar">
        <div class="message-bubble assistant-message">
          <p>Claro, ¿qué tipo de zapatillas para correr estás buscando? ¿Alguna marca o característica en particular?</p>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div class="message-group assistant">
        <img width="48" height="48" src="https://img.icons8.com/parakeet/48/chatbot.png" alt="Assistant" class="message-avatar">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        class="message-input"
        v-model="messageText"
        @keyup.enter="sendMessage"
        aria-label="Escribe tu mensaje"
      />
      <button type="button" class="send-btn" @click="sendMessage" aria-label="Enviar mensaje">
        <span class="arrow">➤</span>
      </button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ChatBot',
  emits: ['close-chat'],
  data() {
    return { messageText: '' }
  },
  methods: {
    closeChat() {
      this.$emit('close-chat')
    },
    sendMessage() {
      const text = this.messageText.trim()
      if (!text) return
      // aquí iría la lógica real para enviar el mensaje al backend o manejarlo
      console.log('Message sent:', text)
      this.messageText = ''
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-wrapper {
  position: fixed;
  bottom: 90px; /* above the floating button */
  right: 24px;
  z-index: 1500;
  display: flex;
  align-items: flex-end;
}

.chat-container {
  width: 100%;
  max-width: 420px;
  height: 560px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  transform-origin: bottom right;
  transition: transform 160ms ease, opacity 160ms ease;
}

/* Header */
.chat-header {
  background: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  font-size: 12px;
  color: #4caf50;
  text-align: left;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-group {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-group.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.assistant-message {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.user-message {
  background: #b3e34f;
  color: white;
  text-align: left;
}

.message-bubble p {
  margin: 0;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

/* Input Area */
.input-area {
  background: white;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #b3e34f;
}

.message-input::placeholder {
  color: #999;
}

.send-btn {
  background: #b3e34f;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #a3d340;
}

.arrow {
  font-size: 18px;
  color: white;
}

/* Scrollbar Styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

@media (max-width: 480px) {
  .chat-wrapper {
    right: 12px;
    bottom: 12px;
  }

  .chat-container {
    width: calc(100vw - 24px);
    max-width: none;
    height: 60vh;
    border-radius: 10px;
  }
}
</style>