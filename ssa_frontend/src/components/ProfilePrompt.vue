<template>
  <div v-if="showPrompt" class="profile-prompt-container">
    <div class="profile-prompt-content">
      <h3 class="prompt-title">¡Bienvenido! 👋</h3>
      <p class="prompt-message">
        Para que podamos mostrarte productos personalizados y mejorar tu experiencia, necesitamos completar algunos datos en tu perfil.
      </p>
      <button @click="goToProfile" class="prompt-button">
        Completar Datos Ahora
      </button>
      <button @click="dismissPrompt" class="prompt-close" aria-label="Cerrar">
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'; // Importamos 'watch'
import { useRouter, useRoute } from 'vue-router'; // Importamos 'useRoute'

// Importa tu cliente de API (que debe enviar el token JWT)
import apiClient from '@/services/api'; 

const router = useRouter();
const route = useRoute(); // Instancia de la ruta actual
const showPrompt = ref(false);
const USER_PROMPT_DISMISSED_KEY = 'profile_prompt_dismissed'; 

// --- LÓGICA DE VERIFICACIÓN ---

/**
 * Función central para verificar si se debe mostrar la notificación.
 * @param {boolean} checkRoute - Indica si se debe verificar la ruta actual.
 */
const checkProfileStatus = async (checkRoute = true) => {
  const token = localStorage.getItem('accessToken');
  
  // 1. Si estamos en la ruta de Login, NO hacemos nada.
  // ⚠️ Asegúrate de que el 'name' de tu ruta de login sea 'login'.
  if (checkRoute && route.name === '/login') {
    showPrompt.value = false;
    return;
  }
  
  // 2. Si no hay token, no se muestra (ya se maneja en el paso 1, pero es una doble verificación).
  if (!token) {
    showPrompt.value = false;
    return;
  }

  // 3. Verificar si ya fue cerrada manualmente en esta sesión.
  if (sessionStorage.getItem(USER_PROMPT_DISMISSED_KEY) === 'true') {
    return;
  }
  
  try {
    // 4. Llama al endpoint del backend
    const response = await apiClient.get('/perfil/estado'); 
    const isProfileComplete = response.data.perfilCompleto; 

    // 5. Muestra si el perfil está incompleto
    showPrompt.value = !isProfileComplete;

  } catch (error) {
    // Si falla la API (ej. 401 token expirado), se oculta la notificación
    console.warn("Error al verificar estado del perfil. Asumiendo que no debe mostrarse el prompt.");
    showPrompt.value = false;
  }
};

// --- WATCHER PARA REACCIONAR A LOS CAMBIOS DE RUTA/TOKEN ---

/**
 * Este watcher se ejecuta al cargar la página y cada vez que cambia la ruta.
 * Esto asegura que la lógica se evalúe cuando el usuario termina de hacer login 
 * y pasa de la ruta '/login' a otra ruta.
 */
watch(
  () => route.path, 
  () => {
    // Retrasamos ligeramente la verificación para asegurar que el token se haya guardado 
    // en localStorage después del login exitoso y la navegación.
    setTimeout(() => {
        checkProfileStatus(true);
    }, 100); 
  },
  { immediate: true } // Ejecuta la verificación inmediatamente al cargar el componente.
);


// --- FUNCIONES DE ACCIÓN ---

const dismissPrompt = () => {
    showPrompt.value = false;
    sessionStorage.setItem(USER_PROMPT_DISMISSED_KEY, 'true'); 
};

const goToProfile = () => {
    showPrompt.value = false;
    router.push({ name: 'perfil' }); 
};
</script>

<style scoped>
/* Los estilos CSS no necesitan cambios, mantienen la funcionalidad y estética. */
.profile-prompt-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
}

.profile-prompt-content {
  background-color: #fff;
  color: #333;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.prompt-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #AAD500;
  margin-bottom: 10px;
}

.prompt-message {
  font-size: 1rem;
  margin-bottom: 20px;
}

.prompt-button {
  background-color: #AAD500;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.prompt-button:hover {
  background-color: #90b300;
}

.prompt-close {
  position: absolute;
  top: 5px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
}
</style>