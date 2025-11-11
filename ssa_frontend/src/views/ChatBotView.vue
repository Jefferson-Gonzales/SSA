<template>
  <div class="chat-wrapper" role="dialog" aria-label="Asistente de compras">
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-content">
          <img width="45" height="45" src="../assets/ic_bot.png" alt="chatbot"/>
          <div class="header-info">
            <h3 class="header-title">Asistente de compras</h3>
            <span class="status-badge">Online</span>
          </div>
        </div>
        <button type="button" class="close-btn" @click="closeChat" aria-label="Cerrar chat">×</button>
      </div>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <!-- Loop through messages -->
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message-group', message.type]"
        >
          <!-- Assistant messages -->
          <template v-if="message.type === 'assistant'">
            <img width="48" height="48" src="../assets/ic_bot.png" alt="Assistant" class="message-avatar">
            <div class="message-bubble assistant-message">
              <p>{{ message.text }}</p>
            </div>
          </template>

          <!-- User messages -->
          <template v-else>
            <div class="message-bubble user-message">
              <p>{{ message.text }}</p>
            </div>
            <img width="100" height="100" src="https://img.icons8.com/stickers/100/user-male-circle.png" alt="User" class="message-avatar">
          </template>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message-group assistant">
          <img width="48" height="48" src="../assets/ic_bot.png" alt="Assistant" class="message-avatar">
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
          :disabled="isTyping"
          aria-label="Escribe tu mensaje"
        />
        <button 
          type="button" 
          class="audio-btn" 
          @click="startAudio" 
          aria-label="Enviar audio" 
          style="margin-right: 8px;"
          :disabled="isTyping"
        >
          <img width="27" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC5klEQVR4nO2Yz2oUQRDGZw0aNNGTD2BU9OBR1yTmsEZBPYh3xaDgUVHQg+ApiEhACSqJUcEnEFHIQZIoBPQVdPUQMIp/MCCYSGQDm58U1Cxlu87OLD2b2TUfNAPVXVXf113du91BsIoWA3AAuA8UgZ/aimrrD7IKYCvwgtp4LmODLAHoBeaIDxnbG2QBwDaHfAkYAbqBDm0icBRYckR0ZUGALZsvwO6IsXkdE2KysWyrb1g783ti+OSdldjfGLbVyTwwREYS+N01fvfSZRlN5K0h0p3AT/ZEiGK6LKOJLBginQn8Nhq/hXRZRhOpoA7fGXWdSYdd+gK2A5fkmw67lAVkAvzPK0AL7IEK0mEXj8SiclhsVgEXgHfyzbQA4DrwS74eY1YVkEauQP+oCUoNEFDynSsqWRuwS74eY1bgg3utZONqHm9WAWU1lz3GnFfzvA/uqc1WRMwTwCv5+uAe+bfZzNYf9hjxNhm/H96IRiSUsz7EDmOX9556LjT7jN+bKn3HgJxPAdMm4RFjl8eqEKMJ4o0ZvzFj7wOW1X7Wp4Bhk/C2sffXcanf61zqC/+4Y1/zKaBgAr+3576+tIWQJ5N8DfJfzfgJ07cO+FZPScYR0OY8Xp0yfV1O35K+Okgtd2rr07KxMy9kt5g450zfrNc9oAmuOAk6TF9PwqdFId9j/Dc7K3PeK3lNsh74aJI8trOkKzEZg/yEM/NrgGdOibZ7F6DJjjtkbrhLLS9t8lglx6P+fkh7rSVUqFKaD028sj3l0hJx0xHxyJZTgjhSNk+cWFfTYf33rD11En8ATks5xPBvB844NY+uWk1/nyLclQjr9w5wGNhpntdlfxwFbgGfHZ9lYMj7qZNgT3yifswChxpO3BGxQY/YuYTELyb5A9iosipoaU07gr4DL/W+exBYG2QdwKARMBg0G1gV0CDI8QecBC47bcoImKrSLz65LAgYoH4MrDT/lhCQ03IYStiyUUIrjd+bjgyI3NkBgwAAAABJRU5ErkJggg==" alt="microphone">
        </button>
        <button 
          type="button" 
          class="send-btn" 
          @click="sendMessage" 
          :disabled="isTyping"
          aria-label="Enviar mensaje"
        >
          <span class="arrow">➤</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatBot',
  emits: ['close-chat'],
  data() {
    return { 
      messageText: '',
      messages: [
        {
          type: 'assistant',
          text: 'Hola, soy tu asistente de compras. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date()
        }
      ],
      isTyping: false,
      apiUrl: 'http://localhost:8080/api/chatbot/message'
    }
  },
  methods: {
    closeChat() {
      this.$emit('close-chat')
    },
    
    async sendMessage() {
      const text = this.messageText.trim()
      if (!text || this.isTyping) return

      // Agregar mensaje del usuario
      this.messages.push({
        type: 'user',
        text: text,
        timestamp: new Date()
      })

      this.messageText = ''
      this.isTyping = true

      try {
        // Llamar al backend
        const response = await axios.post(this.apiUrl, {
          message: text
        })

        // Agregar respuesta del bot
        this.messages.push({
          type: 'assistant',
          text: response.data.response,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error al enviar mensaje:', error)
        this.messages.push({
          type: 'assistant',
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
          timestamp: new Date()
        })
      } finally {
        this.isTyping = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    startAudio() {
      alert('Funcionalidad de audio próximamente')
    }
  },

  mounted() {
    this.scrollToBottom()
  }
}
</script>

<style scoped>
.audio-btn {
  background-color: #b3e34f;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50px;
  transition: all 0.2s;
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-btn:hover:not(:disabled) {
  background-color: #a3d340;
  color: #ffffff;
  border-radius: 60px;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-wrapper {
  position: fixed;
  bottom: 90px;
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
  object-fit: contain;
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

.send-btn:hover:not(:disabled) {
  background: #a3d340;
}

.arrow {
  font-size: 18px;
  color: white;
}

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