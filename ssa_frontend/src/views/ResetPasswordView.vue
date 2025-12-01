<template>
  <div class="password-reset-container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">Saga Smart</div>
        <a href="/login" class="nav-link">Volver a Iniciar Sesión</a>
      </div>
    </nav>

    <div class="reset-wrapper">
      <div class="branding-section">
        <div class="brand-content">
          <h1>Recupera tu Acceso</h1>
          <p>Restablece tu contraseña de forma segura</p>
          
          <div class="benefits">
            <div class="benefit-item">
              <div class="benefit-icon">🔒</div>
              <span>Conexión segura</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">⚡</div>
              <span>Proceso rápido</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <span>Validación automática</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h2>Restablecer Contraseña</h2>
            <p v-if="!isValidToken" class="error-message">
              {{ validationMessage }}
            </p>
            <p v-else class="success-message">
              Token de seguridad verificado
            </p>
          </div>

          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Validando tu token de seguridad...</p>
          </div>

          <form v-else-if="isValidToken && !isSuccess" @submit.prevent="resetPassword" class="password-form">
            <div class="form-group">
              <label for="password" class="form-label">Nueva Contraseña</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  type="password"
                  v-model="newPassword"
                  placeholder="Ingresa tu nueva contraseña"
                  class="form-input"
                  required
                />
                <span class="lock-icon">🔐</span>
              </div>
              <p class="input-hint">Mínimo 8 caracteres, mayúsculas, minúsculas y números.</p>
            </div>

            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirmar Contraseña</label>
              <div class="input-wrapper">
                <input
                  id="confirm-password"
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  class="form-input"
                  :class="{ 'input-error': !passwordsMatch && confirmPassword.length > 0 }"
                />
                <span class="lock-icon" :class="{ 'check-ok': passwordsMatch && confirmPassword.length > 0 }">
                  {{ passwordsMatch && confirmPassword.length > 0 ? '✓' : '🔐' }}
                </span>
              </div>
              <p v-if="!passwordsMatch && confirmPassword.length > 0" class="error-message">
                Las contraseñas no coinciden.
              </p>
            </div>

            <button
              type="submit"
              :disabled="!passwordsMatch || isResetting"
              class="submit-button"
              :class="{ 'button-loading': isResetting }"
            >
              <span v-if="isResetting" class="button-spinner"></span>
              <span>{{ isResetting ? 'Cambiando...' : 'Cambiar Contraseña' }}</span>
            </button>
          </form>

          <div v-if="isSuccess" class="success-state">
            <div class="success-icon">✓</div>
            <h3>¡Contraseña Restablecida!</h3>
            <p>Tu contraseña ha sido cambiada correctamente.</p>
            <p class="redirect-text">Serás redirigido a iniciar sesión en unos segundos...</p>
          </div>


          <div v-if="message && isError" class="error-state">
            <div class="error-icon">⚠</div>
            <p>{{ message }}</p>
            <a href="/login" class="retry-link">Intentar de nuevo</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// sin condiciones para cumplir con Vue 3 Composition API

// Estado del componente
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(true)
const isResetting = ref(false)
const isValidToken = ref(false)
const isSuccess = ref(false)
const message = ref('')
const isError = ref(false)
const validationMessage = ref('El token de restablecimiento es inválido o ha expirado.')

// Clases computadas
const passwordsMatch = computed(() => newPassword.value === confirmPassword.value && newPassword.value.length > 0)

// URL de tu backend
const API_URL = 'https://backendssa.onrender.com/api/auth/reset-password'

const validateToken = () => {
  // Obtener el token de la URL query parameter
  const params = new URLSearchParams(window.location.search)
  token.value = params.get('token') || ''

  if (!token.value) {
    isLoading.value = false
    message.value = 'No se encontró un token de restablecimiento en la URL.'
    isError.value = true
    isValidToken.value = false
    return
  }

  isLoading.value = false
  isValidToken.value = true
}

const resetPassword = async () => {
  if (!passwordsMatch.value) {
    message.value = 'Error: Las contraseñas ingresadas no coinciden.'
    isError.value = true
    return
  }

  isResetting.value = true
  message.value = ''
  isError.value = false

  try {
    const payload = {
      token: token.value,
      newPassword: newPassword.value
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      isSuccess.value = true
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    } else {
      const data = await response.json()
      isError.value = true
      message.value = data.message || 'El enlace de restablecimiento es inválido o ha expirado.'
      isValidToken.value = false
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error)
    isError.value = true
    message.value = 'Error de conexión con el servidor. Por favor, inténtalo de nuevo.'
  } finally {
    isResetting.value = false
  }
}

onMounted(() => {
  validateToken()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.password-reset-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #C5E01B;
}

.reset-wrapper {
  display: flex;
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  gap: 3rem;
}


.branding-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%);
  border-radius: 20px;
  padding: 3rem;
  color: white;
}

.brand-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
}

.brand-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.benefit-icon {
  font-size: 1.5rem;
}

.benefit-item span {
  font-size: 1rem;
  font-weight: 500;
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.form-header p {
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.success-message {
  color: #C5E01B;
  font-weight: 600;
}

.error-message {
  color: #dc3545;
  font-weight: 600;
}


.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #C5E01B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 0.95rem;
}


.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #C5E01B;
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.1);
}

.form-input.input-error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.lock-icon {
  position: absolute;
  right: 0.75rem;
  font-size: 1.2rem;
  color: #999;
  transition: all 0.3s ease;
}

.lock-icon.check-ok {
  color: #C5E01B;
}

.input-hint {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.4rem;
  line-height: 1.4;
}


.submit-button {
  padding: 0.75rem 1.5rem;
  background: #C5E01B;
  color: #1a1a1a;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: #b3c900;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(197, 224, 27, 0.3);
}

.submit-button:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #1a1a1a;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}


.success-state {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #C5E01B;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.success-state h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.success-state p {
  color: #666;
  font-size: 0.95rem;
  margin: 0.5rem 0;
}

.redirect-text {
  font-size: 0.85rem;
  color: #999;
  margin-top: 1rem;
}

.error-state {
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(220, 53, 69, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.error-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.error-state p {
  color: #dc3545;
  font-size: 0.95rem;
  line-height: 1.6;
}

.retry-link {
  display: inline-block;
  margin-top: 1rem;
  color: #C5E01B;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.retry-link:hover {
  color: #b3c900;
  text-decoration: underline;
}


@media (max-width: 1024px) {
  .reset-wrapper {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }

  .branding-section {
    padding: 2rem;
  }

  .brand-content h1 {
    font-size: 2rem;
  }

  .form-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .logo {
    font-size: 1.25rem;
  }

  .brand-content h1 {
    font-size: 1.5rem;
  }

  .brand-content p {
    font-size: 0.95rem;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .branding-section {
    padding: 1.5rem;
  }
}
</style>
