<template>
  <div class="registration-container">
    <div class="registration-wrapper">
      <!-- Left Side - Branding -->
      <div class="registration-branding">
        <div class="brand-content">
          <h1 class="brand-title">ShopAssist AI</h1>
          <p class="brand-tagline">Descubre moda inteligente</p>
          <div class="brand-benefits">
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <p>Acceso exclusivo a ofertas</p>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <p>Envío gratis en compras</p>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <p>Devoluciones sin costo</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="registration-form-wrapper">
        <div class="form-container">
          <h2 class="form-title">Crear Cuenta</h2>
          <p class="form-subtitle">Únete a nuestra comunidad de moda</p>

          <form @submit.prevent="handleSubmit" class="registration-form">
            <!-- Name Fields -->
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Nombre</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  class="form-input"
                  @input="validateNombres"
                  required
                />
                <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
              </div>

              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  placeholder="Ingresa tu apellido"
                  class="form-input"
                  @input="validateApellidos"
                  required
                />
                 <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
              </div>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="tu@gmail.com"
                class="form-input"
                required
              />
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                class="form-input"
                @input="validatePassword"
                required
              />
              <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
              <p class="password-hint">Usa mayúsculas, números y caracteres especiales</p>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                class="form-input"
                @input="validateConfirmPassword"
                required
              />
              <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
            </div>

            <!-- Terms & Conditions -->
            <div class="form-checkbox">
              <input
                id="terms"
                v-model="form.terms"
                type="checkbox"
                class="checkbox-input"
                required
              />
              <label for="terms" class="checkbox-label">
                Acepto los <a href="#" class="link">términos y condiciones</a> y la
                <a href="#" class="link">política de privacidad</a>
              </label>
            </div>

            <!-- Newsletter Checkbox -->
            <div class="form-checkbox">
              <input
                id="newsletter"
                v-model="form.newsletter"
                type="checkbox"
                class="checkbox-input"
              />
              <label for="newsletter" class="checkbox-label">
                Deseo recibir ofertas y novedades por correo
              </label>
            </div>

            <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
            <button type="submit" class="submit-button" :disabled="isLoading || !isFormValid"> 
              {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>

            <!-- Submit Button 
            <button type="submit" class="submit-button">Crear Cuenta</button>-->

            <!-- Login Link -->
            <p class="login-link">
              ¿Ya tienes cuenta? <router-link to="/login" class="link">Inicia sesión aquí</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
    <!-- 🔹 Modal de éxito de registro -->
<div v-if="showSuccessModal" class="modal-overlay">
  <div class="modal-dialog">
    <h3 class="modal-title">¡Cuenta creada con éxito! 🎉</h3>
    <p class="modal-text">
      Tu cuenta ha sido creada correctamente.  
      Ahora puedes iniciar sesión para empezar a comprar.
    </p>
    <div class="modal-actions">
      <button type="button" class="modal-btn" @click="goToLogin">
        Ir a iniciar sesión
      </button>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// 🛑 IMPORTAR TU CLIENTE AXIOS/API
import apiClient from '@/services/api'; // Asegúrate de que esta ruta sea correcta

const router = useRouter()
const isLoading = ref(false) // Estado para manejar la carga
const errorMsg = ref('') // Estado para mostrar errores del servidor
const showSuccessModal = ref(false) // Estado para mostrar el modal de éxito

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
  newsletter: true, // No se envía, pero se mantiene para la UI
})

//para la validacion de campos
const errors = ref({
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
})

// --- CONSTANTES Y REGEX ---
const MIN_PASSWORD_LENGTH = 8;
const nameRegex = /^[a-zA-Z\sñÑáÁéÉíÍóÓúÚ]+$/;

// --- FUNCIONES DE VALIDACIÓN ---

const validateNombres = () => {
   errors.value.firstName = '';
   const value = form.value.firstName.trim();
   if (value && !nameRegex.test(value)) {
     errors.value.firstName = 'Solo se permiten letras y espacios.';
    }
  };

const validateApellidos = () => { // ✅ CORREGIDO: El nombre de la función en el template era incorrecto
 errors.value.lastName = '';
 const value = form.value.lastName.trim();
 if (value && !nameRegex.test(value)) {
  errors.value.lastName = 'Solo se permiten letras y espacios.';
}
};

const validatePassword = () => {
  errors.value.password = '';
  if (form.value.password.length > 0 && form.value.password.length < MIN_PASSWORD_LENGTH) {
    errors.value.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  
  // Re-validar la confirmación cuando cambia la contraseña
  validateConfirmPassword();
};

const validateConfirmPassword = () => {
  errors.value.confirmPassword = '';
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden.';
  }
};

// --- COMPUTED PARA ESTADO GENERAL DEL FORMULARIO ---
const isFormValid = computed(() => {
  // 1. Verificar errores de campo
  const hasFieldErrors = Object.values(errors.value).some(e => e !== '');

  // 2. Verificar que los campos requeridos estén llenos y cumplan con la longitud mínima
  const fieldsAreValid = 
  form.value.firstName.trim() !== '' &&
  form.value.lastName.trim() !== '' &&
  form.value.email.trim() !== '' &&
  form.value.password.length >= MIN_PASSWORD_LENGTH &&
  form.value.password === form.value.confirmPassword &&
  form.value.terms;
  
  return fieldsAreValid && !hasFieldErrors;
});

const handleSubmit = async () => {
  errorMsg.value = '' // Limpiar errores anteriores

  // 1. Validaciones básicas del Frontend
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = 'Las contraseñas no coinciden.';
    return
  }
  if (!form.value.terms) {
    errorMsg.value = 'Debes aceptar los términos y condiciones.';
    return
  }

  // 2. Crear el DTO de Registro (Asegurar que los nombres de las claves coincidan con el Backend)
  // Backend espera: { nombres, apellidos, email, password }
  const registrationData = {
    nombres: form.value.firstName,
    apellidos: form.value.lastName,
    email: form.value.email,
    password: form.value.password, // Enviamos la contraseña sin hash
    // Asegúrate de que el backend no necesite 'contrasenaHash', 
    // ya que lo codifica internamente con PasswordEncoder
  }

  isLoading.value = true // Activar estado de carga

  try {
    // 3. Llamada al Backend
    // Endpoint: POST /api/auth/registro
    const response = await apiClient.post('/auth/registro', registrationData)

    // 4. Manejo de éxito
    console.log('Registro exitoso:', response.data)

    showSuccessModal.value = true;


  } catch (error) {
    // 5. Manejo de errores
    console.error('Error durante el registro:', error)
    
    // Extraer mensaje de error del backend (si está disponible)
    if (error.response && error.response.data) {
      // Si el backend devuelve un string de error (como "El email ya está en uso")
      errorMsg.value = error.response.data
    } else {
      errorMsg.value = 'Fallo al conectar con el servidor. Inténtalo de nuevo.'
    }
    
  } finally {
    isLoading.value = false // Desactivar estado de carga
  }
}

// 🔹 NUEVO: función para cerrar modal e ir al login
const goToLogin = () => {
  showSuccessModal.value = false
  router.push('/login')
}


</script>

<!-- 
<script setup>
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
  newsletter: true,
})

const handleSubmit = () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  if (!form.value.terms) {
    alert('Debes aceptar los términos y condiciones')
    return
  }
  console.log('Registrando usuario:', form.value)
  alert('¡Cuenta creada exitosamente!')
}
</script>
-->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.registration-container {
  /* min-height: 100vh; */
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.registration-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Left Side - Branding */
.registration-branding {
  background: linear-gradient(135deg, #2a3f2f 0%, #1a2618 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.brand-content {
  width: 100%;
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
}

.brand-benefits {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.benefit-icon {
  width: 28px;
  height: 28px;
  background-color: #c5e01b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a2618;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.benefit-item p {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

/* Right Side - Form */
.registration-form-wrapper {
  padding: 20px 60px;
  margin-left: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #c5e01b;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.password-hint {
  font-size: 12px;
  color: #999;
  margin-top: -4px;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 4px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #c5e01b;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  cursor: pointer;
}

.link {
  color: #c5e01b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.link:hover {
  color: #a3b818;
  text-decoration: underline;
}

.submit-button {
  background-color: #c5e01b;
  color: #1a1a1a;
  border: none;
  padding: 14px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  letter-spacing: 0.3px;
}

.submit-button:hover {
  background-color: #a3b818;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(197, 224, 27, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  font-size: 13px;
  color: #666;
  margin-top: 12px;
}

.login-link .link {
  color: #c5e01b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .registration-wrapper {
    grid-template-columns: 1fr;
    height: auto;
  }

  .registration-branding {
    padding: 40px 30px;
    min-height: 300px;
  }

  .brand-title {
    font-size: 28px;
  }

  .registration-form-wrapper {
    padding: 40px 30px;
  }

  .form-title {
    font-size: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .registration-container {
    padding: 16px;
  }

  .registration-branding {
    padding: 32px 20px;
  }

  .registration-form-wrapper {
    padding: 32px 20px;
  }

  .brand-title {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .brand-benefits {
    gap: 16px;
  }

  .benefit-item p {
    font-size: 13px;
  }

  .form-container {
    max-width: 100%;
  }

  .form-title {
    font-size: 20px;
  }
}
/* 🛑 Ajustes mínimos de estilo para mostrar el error */
.form-error {
    color: #cc0000;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 15px;
}

/* 🛑 Estilos para el botón de carga */
.submit-button[disabled] {
    background-color: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* 🔹 Modal de éxito de registro */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-dialog {
  background: #ffffff;
  max-width: 420px;
  width: 90%;
  border-radius: 12px;
  padding: 24px 20px 20px;
  box-shadow: 0 20px 30px rgba(15, 23, 42, 0.25);
  text-align: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2933;
}

.modal-text {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.modal-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background-color: #c5e01b;
  color: #1a1a1a;
  transition: background-color 0.15s ease, transform 0.05s ease;
}

.modal-btn:hover {
  background-color: #a3b818;
  transform: translateY(-1px);
}

</style>
