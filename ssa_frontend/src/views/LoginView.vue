<template>
  <div class="login-page">
    <div class="title">
        <h1 class="">SAGASMART</h1>
        <p>Inicia sesión en tu cuenta</p>
    </div>

    <span>o <span style="color: #AAD500; font-weight: bold;">regístrate y empieza a comprar</span></span>
    <div class="login-card">
      <label for="">Correo Electronico</label>
      <input type="text"  v-model= "email" placeholder="Ingresa tu Email">
      <label for="">Contraseña</label>
      <input type="password" v-model="password" placeholder="Tu Contraseña">
      
      <router-link to="/" class="forgot-password">¿Olvidaste tu contraseña?</router-link>
      
      <button class="btnIniciar" @click="login">Iniciar Sesión</button>
      
      <div class="links">
        <router-link to="/registro">¿No tienes una cuenta?</router-link>
      </div>

      <router-link to="/registro" class="btnRegistro" custom v-slot="{ navigate }">
        <button @click="navigate" class="btnRegistro">Regístrarse</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// Importamos useRouter para navegar después del login
import { useRouter } from 'vue-router'; 

// Inicializamos el router para la navegación
const router = useRouter();

// Estados del formulario
const email = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);

// URL del endpoint de autenticación (Asegúrate de que coincida con tu backend)
const LOGIN_URL = 'http://localhost:8080/api/auth/login';

/**
 * Maneja el envío del formulario de inicio de sesión.
 * Llama a la API, guarda el token y redirige.
 */
const login = async () => {
  errorMessage.value = null; // Limpiar errores anteriores
  isLoading.value = true;    // Activar el estado de carga

  try {
    // 1. Llamada a la API de autenticación
    const response = await axios.post(LOGIN_URL, {
      email: email.value,
      password: password.value
    });
    
    // 2. Extracción y Almacenamiento del Token (CRÍTICO)
    const accessToken = response.data.accessToken; 
    
    if (accessToken) {
      // Guardar el token en localStorage. 
      // El 'apiClient.js' lo leerá automáticamente para todas las peticiones protegidas.
      localStorage.setItem('accessToken', accessToken); 
      
      // 3. Redirigir al catálogo de productos
      router.push('/catalogo'); 

    } else {
      errorMessage.value = 'Inicio de sesión exitoso, pero no se recibió el token de acceso.';
    }

  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    
    // Manejo específico de errores HTTP (ej. credenciales inválidas)
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 401) {
        errorMessage.value = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else {
        errorMessage.value = `Error del servidor (${error.response.status}). Inténtalo de nuevo más tarde.`;
      }
    } else {
      errorMessage.value = 'No se pudo conectar con el servidor de autenticación.';
    }
  } finally {
    isLoading.value = false; // Desactivar el estado de carga
  }
};
</script>



<!--
<script>
// Importa tu cliente Axios configurado (asumiendo que está en '@/services/api')
//import apiClient from '@/services/api'; 
import axios from 'axios';
// Importa el router de Vue (necesario para la redirección)
//import router from '@/router'; 

export default {
  data() {
    return {
      // Variables vinculadas con los inputs (v-model)
      email: '',
      password: '',
      // Variable para mostrar errores de login (RNF-01)
      error: null,
    };
  },
  methods: {
    async login() {
      // 1. Limpiar cualquier error anterior
      this.error = null;

      try {
        // 2. Llamada al endpoint de login en tu Spring Boot (http://localhost:8080/api/auth/login)
        const LOGIN_URL = 'http://localhost:8080/api/auth/login';
        const response = await axios.post(LOGIN_URL, {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        const userData = response.data.usuario;

        // 3. Guardar el token en el Local Storage
        localStorage.setItem('jwtToken', token);
        
        
        // Opcional: Guardar datos básicos del usuario
        localStorage.setItem('user', JSON.stringify(userData)); 

        // 4. Redirigir a la página principal protegida
        console.log('Login exitoso. Redirigiendo a Catalogo.');
        this.$router.replace({ name: 'catalogo' }); 

      } catch (err) {
        // 5. Manejar errores de credenciales (RNF-01)
        if (err.response && (err.response.status === 400 || err.response.status === 401)) {
          this.error = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
        } else {
          this.error = 'Ocurrió un error al intentar iniciar sesión. Intenta de nuevo.';
        }
        console.error('Login error:', err);
      }
    },
  },
};
</script>
-->


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Holtwood+One+SC&display=swap');

/* Añade esto a tu bloque <style scoped> */
.error-message {
    color: red;
    background-color: #fdd;
    padding: 10px;
    border: 1px solid #f99;
    border-radius: 5px;
    margin-top: 15px;
    font-weight: bold;
    text-align: center;
    width: 100%;
    max-width: 420px;
    box-sizing: border-box;
}

.title {
    font-weight: bold;
    color: black;
}

.title h1{
    font-family: "Holtwood One SC", serif;
    font-size: 45px;
    margin: 0;
}

.title p{
    font-size: 34px;
    margin: 0;
}

.login-page span {
    font-size: 20px;
    margin-top: 10px;
}

.forgot-password{
  display: block;
  width: 100%;
  margin-top: 10px;
  text-align: left;
  text-decoration: none;
  font-weight: bold;
  color: #2F99DC;
}


.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F9FAFB;
}
.login-card {
  padding: 40px;
  margin: 20px auto 0 auto;
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  text-align: left;
}

.login-card label {
    text-align: left;
    font-weight: bold;
    display: block;
}

input {
    border: 2px #7E7E7E solid;
}

input, button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  box-sizing: border-box;
}

button {
    margin-top: 20px;
    margin-bottom: 20px;
}

.btnIniciar {
  background-color: #AAD500;
  color: white;
  font-weight: bold;
  padding: 15px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btnRegistro {
    background-color: #F0F3F4;
    color: black;
    font-weight: bold;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 15px;
}

.links a {
  color: #7E7E7E;
  text-decoration: none;
  text-align: center;
}

.links {
  text-align: center;
  margin-top: 10px;
}
</style>

