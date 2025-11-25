<template>
  <transition name="fade">
    <div v-if="isVisible" :class="['toast', typeClasses]">
      <div class="toast-content">
        <span class="icon">{{ icon }}</span>
        <p>{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    // El mensaje a mostrar (e.g., "Añadido con éxito")
    message: {
      type: String,
      required: true,
    },
    // El tipo de mensaje: 'success' o 'remove'
    type: {
      type: String,
      default: 'success', // 'success' o 'remove'
      validator: (value) => ['success', 'remove'].includes(value),
    },
  },
  data() {
    return {
      isVisible: false,
      timeout: null,
    };
  },
  computed: {
    // Clases dinámicas basadas en el tipo de mensaje
    typeClasses() {
      return {
        'toast-success': this.type === 'success',
        'toast-remove': this.type === 'remove',
      };
    },
    icon() {
      return this.type === 'success' ? '✅' : '🗑️';
    },
  },
  methods: {
    // Método que se llama desde la vista padre para mostrar el toast
    show() {
      clearTimeout(this.timeout); // Limpia si se está mostrando otro
      this.isVisible = true;

      // Ocultar automáticamente después de 3 segundos
      this.timeout = setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* Estilos para posicionar el toast en la esquina superior derecha */
.toast {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 280px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 1.5em;
}

/* Colores para el estado de ÉXITO (Añadido) */
.toast-success {
  background-color: #4CAF50; /* Verde */
}

/* Colores para el estado de REMOVIDO (Quitado) */
.toast-remove {
  background-color: #FF5722; /* Naranja/Rojo */
}

/* Transiciones (para el efecto de entrada/salida) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(-20px); /* Entra deslizándose desde arriba */
}
</style>