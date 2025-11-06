<template>
  <!-- Main Container: Centered Layout con fondo gris claro -->
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    
    <!-- Bloque de Cabecera y Título: Estilo SAGASMART -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h1 class="text-5xl font-extrabold text-gray-900 title-sagasmart">
        SAGASMART
      </h1>
      <h2 class="mt-4 text-center text-3xl font-bold text-gray-900">
        ¿Olvidaste tu Contraseña?
      </h2>
      <p class="mt-2 text-center text-base text-gray-600">
        Ingresa tu correo electrónico para recibir un enlace de restablecimiento.
      </p>
    </div>

    <!-- Tarjeta del Formulario (Similar al Login) -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-10 px-6 shadow-xl rounded-xl sm:px-12">
        
        <form @submit.prevent="requestReset" class="space-y-6">
          
          <!-- Campo de Correo Electrónico -->
          <div>
            <label for="email" class="block text-sm font-bold text-gray-900 mb-2">
              Correo Electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                placeholder="Ingresa tu email"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm input-sagasmart"
              />
            </div>
          </div>

          <!-- Botón de Envío: Color de Marca Principal (#AAD500) -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 transition ease-in-out duration-150"
            >
              <span v-if="isLoading">Enviando...</span>
              <span v-else>Enviar Enlace de Restablecimiento</span>
            </button>
          </div>
        </form>

        <!-- Mensaje de Estado (Éxito o Error) -->
        <div v-if="message" class="mt-6 p-4 rounded-lg text-center font-medium border" :class="messageClass">
          {{ message }}
        </div>
        
        <!-- Enlace para volver al login: Color de Marca Secundario (#2F99DC) -->
        <div class="mt-6 text-center">
            <router-link to="/login" class="text-sm font-medium text-brand-blue hover:text-brand-blue-dark transition ease-in-out duration-150">
                &larr; Volver a Iniciar Sesión
            </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

// Estado del formulario
const email = ref('');
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

// Clase dinámica para el mensaje de estado (éxito o error)
const messageClass = computed(() => ({
    // Clase para errores (rojo estándar de Tailwind)
    'bg-red-100 text-red-800 border-red-300': isError.value, 
    // Clase para éxito/informativo (verde claro de Tailwind, coherente con la marca)
    'bg-lime-50 text-lime-800 border-lime-300': !isError.value && message.value,
}));

// URL de tu backend
const API_URL = 'http://localhost:8080/api/auth/forgot-password';

/**
 * Maneja el envío de la solicitud de restablecimiento de contraseña.
 */
const requestReset = async () => {
    isLoading.value = true;
    message.value = '';
    isError.value = false;

    try {
        const response = await axios.post(API_URL, {
            email: email.value
        });

        // La respuesta del backend es intencionalmente genérica por seguridad.
        if (response.status === 200) {
            message.value = 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en breve. Revisa tu bandeja de entrada y spam.';
        } else {
            message.value = 'Ocurrió un error inesperado. Inténtalo más tarde.';
            isError.value = true;
        }

    } catch (error) {
        console.error('Error al solicitar restablecimiento:', error);
        // Mensaje de seguridad, intencionalmente no revelamos si el correo existe o no
        message.value = 'Se ha procesado la solicitud. Si el correo existe, el enlace será enviado.';
        isError.value = false; 
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/*
  IMPORTANTE: Incluimos la fuente de Google Fonts para replicar el estilo del logo "SAGASMART" del Login.
  Utilizamos variables CSS para los colores de marca exactos.
*/
@import url('https://fonts.googleapis.com/css2?family=Holtwood+One+SC&display=swap');

/* --- Colores de Marca --- */
:root {
  --color-brand-green: #AAD500; /* Color primario: Botones de Acción */
  --color-brand-green-dark: #91ba00; /* Hover del botón */
  --color-brand-blue: #2F99DC; /* Color secundario: Enlaces */
  --color-brand-blue-dark: #2785c4; /* Hover del enlace */
  --color-input-focus-bg: #F0F5FF; /* Fondo sutil al enfocar el input */
}

/* Clases utilitarias personalizadas para integrar colores de marca con Tailwind */
/* Botón */
.bg-brand-green { background-color: var(--color-brand-green); border-color: var(--color-brand-green); }
.hover\:bg-brand-green-dark:hover { background-color: var(--color-brand-green-dark); }
.focus\:ring-brand-green:focus { --tw-ring-color: var(--color-brand-green); }

/* Enlace/Focus */
.text-brand-blue { color: var(--color-brand-blue); }
.hover\:text-brand-blue-dark:hover { color: var(--color-brand-blue-dark); }
.focus\:ring-brand-blue:focus { --tw-ring-color: var(--color-brand-blue); }
.focus\:border-brand-blue:focus { border-color: var(--color-brand-blue); }


/* Estilo específico para el logo SAGASMART (debe ser coherente con Login.view) */
.title-sagasmart {
  font-family: 'Holtwood One SC', serif;
  font-size: 3rem; /* 48px, equivalente a text-5xl */
  margin-bottom: 0.5rem;
}

/* Estilo para que los inputs se parezcan al diseño del login */
.input-sagasmart:focus {
  background-color: var(--color-input-focus-bg);
  transition: background-color 0.2s;
}
</style>