<template>
  <div class="registration-container">
    <div class="registration-wrapper">
      <!-- Left Side - Branding -->
      <div class="registration-branding">
        <div class="brand-content">
          <h1 class="brand-title">SagaSmart</h1>
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
                  required
                />
              </div>
              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  placeholder="Ingresa tu apellido"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="tu@email.com"
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
                required
              />
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
                required
              />
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

            <!-- Submit Button -->
            <button type="submit" class="submit-button">Crear Cuenta</button>

            <!-- Login Link -->
            <p class="login-link">
              ¿Ya tienes cuenta? <router-link to="/login" class="link">Inicia sesión aquí</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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
</style>
