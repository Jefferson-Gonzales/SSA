<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Restablecer Contraseña
      </h2>
      <p v-if="!isValidToken" class="mt-2 text-center text-sm text-red-600 font-bold">
        {{ validationMessage }}
      </p>
      <p v-else class="mt-2 text-center text-sm text-gray-600">
        Token de seguridad verificado. Ingresa tu nueva contraseña.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Estado de Carga / Validación -->
        <div v-if="isLoading" class="text-center p-4 text-green-600">
            Cargando y validando token...
        </div>

        <!-- Formulario de nueva contraseña (solo si el token es válido) -->
        <form v-else-if="isValidToken && !isSuccess" @submit.prevent="resetPassword">
          
          <div class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  v-model="newPassword"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <p class="mt-1 text-xs text-gray-500">Mínimo 8 caracteres, mayúsculas, minúsculas y números.</p>
              </div>
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div class="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  v-model="confirmPassword"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <p v-if="!passwordsMatch && confirmPassword.length > 0" class="mt-1 text-xs text-red-500">
                Las contraseñas no coinciden.
              </p>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="!passwordsMatch || isResetting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <span v-if="isResetting">Cambiando...</span>
              <span v-else>Cambiar Contraseña</span>
            </button>
          </div>
        </form>

        <!-- Mensaje de éxito o error -->
        <div v-if="message" class="mt-6 p-3 rounded-md text-center" :class="messageClass">
          {{ message }}
        </div>
        
        <!-- Enlace para volver al login -->
        <div class="mt-6 text-center">
            <router-link to="/login" class="text-sm font-medium text-green-600 hover:text-green-500">
                Volver a Iniciar Sesión
            </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Estado del componente
const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(true); // Inicialmente cargando para validar el token
const isResetting = ref(false);
const isValidToken = ref(false); // Estado de la validación del token
const isSuccess = ref(false);
const message = ref('');
const isError = ref(false);
const validationMessage = ref('El token de restablecimiento es inválido o ha expirado.');

// Clases computadas
const passwordsMatch = computed(() => newPassword.value === confirmPassword.value && newPassword.value.length > 0);
const messageClass = computed(() => ({
    'bg-red-100 text-red-800': isError.value,
    'bg-green-100 text-green-800': !isError.value && message.value,
}));

// URL de tu backend
const API_URL = 'http://localhost:8080/api/auth/reset-password';

/**
 * Valida el token al cargar el componente (opcional pero bueno para la UX).
 * Nota: El backend validará el token al recibir el POST final, pero esto verifica que exista.
 */
const validateToken = () => {
    // 1. Obtener el token de la URL
    token.value = route.query.token;

    if (!token.value) {
        isLoading.value = false;
        message.value = 'No se encontró un token de restablecimiento en la URL.';
        isError.value = true;
        isValidToken.value = false;
        return;
    }
    
    // Por simplicidad en el frontend, asumimos que si el token existe, es válido,
    // y dejamos la validación real (expiración, existencia) para el POST final del backend.
    isLoading.value = false;
    isValidToken.value = true;

    // Si tu backend tuviera un endpoint GET /api/auth/validate-token?token=...
    // podrías hacer la llamada aquí para una validación más estricta.
};


/**
 * Maneja el envío de la nueva contraseña al backend.
 */
const resetPassword = async () => {
    if (!passwordsMatch.value) {
        message.value = 'Error: Las contraseñas ingresadas no coinciden.';
        isError.value = true;
        return;
    }

    isResetting.value = true;
    message.value = '';
    isError.value = false;

    try {
        const payload = {
            token: token.value,
            newPassword: newPassword.value // Spring Boot esperará el campo 'password'
        };

        const response = await axios.post(API_URL, payload);

        if (response.status === 200) {
            isSuccess.value = true;
            message.value = '¡Contraseña restablecida con éxito! Serás redirigido a la página de inicio de sesión.';
            // Opcional: Redirigir al login después de un breve retraso
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } else {
            // Este caso debería ser cubierto por el catch, pero por si acaso.
             message.value = 'Ocurrió un error inesperado al cambiar la contraseña.';
             isError.value = true;
        }

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        isError.value = true;
        
        // Manejo de errores específicos del backend (400 Bad Request por token inválido/expirado)
        if (error.response && error.response.status === 400) {
            // Asume que el backend devuelve un 400 si el token es malo
            message.value = error.response.data.message || 'El enlace de restablecimiento es inválido o ha expirado. Solicita uno nuevo.';
            isValidToken.value = false;
        } else {
            message.value = 'Error de conexión con el servidor. Por favor, inténtalo de nuevo.';
        }
    } finally {
        isResetting.value = false;
    }
};

// Se ejecuta al montar el componente
onMounted(validateToken);

</script>

<style scoped>
/* No se requiere CSS personalizado, Tailwind CSS maneja el estilo */
</style>