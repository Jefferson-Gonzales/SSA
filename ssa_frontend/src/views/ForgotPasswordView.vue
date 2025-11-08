<template>
  <div class="reset-container">
    <!-- Left Side - Branding -->
    <div class="reset-left">
      <div class="reset-branding">
        <h1>Recupera tu contraseña</h1>
        <p>Te ayudaremos a acceder a tu cuenta de Saga Smart</p>
      </div>

      <div class="reset-features">
        <div class="feature">
          <div class="feature-icon">✓</div>
          <p>Seguridad garantizada</p>
        </div>
        <div class="feature">
          <div class="feature-icon">✓</div>
          <p>Proceso rápido y sencillo</p>
        </div>
        <div class="feature">
          <div class="feature-icon">✓</div>
          <p>Soporte 24/7 disponible</p>
        </div>
      </div>
    </div>

    <!-- Right Side - Form (mantiene la lógica existente de requestReset) -->
    <div class="reset-right">
      <div class="reset-form-container">
        <div class="reset-form-step">
          <h2>Verifica tu correo</h2>
          <p class="step-description">Ingresa el correo electrónico asociado a tu cuenta</p>

          <form @submit.prevent="requestReset">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                placeholder="tu@correo.com"
                required
              >
            </div>
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Enviando enlace...</span>
              <span v-else>Enviar enlace de recuperación</span>
            </button>
          </form>

          <div v-if="message" class="alert" :class="isError ? 'alert--error' : 'alert--success'" role="status">
            <div class="alert-icon" aria-hidden>
              <svg v-if="!isError" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12.5L4.5 9l-1 1L8 15.5l9-9-1-1L8 12.5z" fill="#43691A"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.41 10l4.3-4.29-1.42-1.42L10 8.59 5.71 4.29 4.29 5.71 8.59 10l-4.3 4.29 1.42 1.42L10 11.41l4.29 4.3 1.42-1.42L11.41 10z" fill="#8B1E1E"/>
              </svg>
            </div>
            <div class="alert-content">{{ message }}</div>
          </div>

          <p class="form-link mt-4">
            ¿Recordaste tu contraseña? <router-link to="/login">Inicia sesión aquí</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Estado del formulario
const email = ref('');
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

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

    if (response.status === 200) {
      message.value = 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en breve. Revisa tu bandeja de entrada y spam.';
    } else {
      message.value = 'Ocurrió un error inesperado. Inténtalo más tarde.';
      isError.value = true;
    }

  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error);
    message.value = 'Se ha procesado la solicitud. Si el correo existe, el enlace será enviado.';
    isError.value = false; 
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.reset-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

/* Left Side - Branding */
.reset-left {
  flex: 1;
  background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.reset-branding h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.reset-branding p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 60px;
  line-height: 1.5;
}

.reset-features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background-color: #c5e01b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d5016;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
}

.feature p {
  font-size: 16px;
  font-weight: 500;
}

/* Right Side - Form */
.reset-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.reset-form-container {
  width: 100%;
  max-width: 450px;
}

.reset-form-step h2 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-weight: 700;
}

.step-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 32px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #c5e01b;
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.1);
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #999;
  font-size: 12px;
}

.btn-primary {
  width: 100%;
  padding: 14px 24px;
  background-color: #c5e01b;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-primary:hover {
  background-color: #b3cc15;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(197, 224, 27, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.form-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.form-link a {
  color: #c5e01b;
  text-decoration: none;
  font-weight: 600;
}

.form-link a:hover {
  text-decoration: underline;
}

/* Alert boxes */
.alert {
  margin-top: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  max-width: 100%;
}
.alert--success {
  background: #f5fde8;
  border: 1px solid #e0f0c1;
  color: #2a5d11;
}
.alert--error {
  background: #fff4f4;
  border: 1px solid #f2c6c6;
  color: #7a1d1d;
}
.alert-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.alert-content {
  flex: 1;
  line-height: 1.4;
}

.reset-success {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: #c5e01b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 48px;
  color: #2d5016;
  font-weight: 700;
}

.reset-success h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-weight: 700;
}

.reset-success p {
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reset-container {
    flex-direction: column;
    height: auto;
  }

  .reset-left {
    padding: 40px 20px;
    min-height: 300px;
    justify-content: flex-start;
    padding-top: 40px;
  }

  .reset-branding h1 {
    font-size: 32px;
  }

  .reset-branding p {
    font-size: 16px;
    margin-bottom: 40px;
  }

  .reset-right {
    padding: 40px 20px;
    min-height: auto;
  }

  .reset-form-container {
    max-width: 100%;
  }

  .reset-form-step h2 {
    font-size: 24px;
  }
}
</style>