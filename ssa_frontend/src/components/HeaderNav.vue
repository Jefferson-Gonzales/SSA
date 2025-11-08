<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <h1 class="logo">SAGASMART</h1>
        <nav class="nav">
          <router-link to="/catalogo" class="nav-link">Home</router-link>
          <router-link to="/ofertas" class="nav-link">Ofertas</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </nav>
      </div>
      <div class="header-right">
        <div class="search-bar">
          <span class="search-icon" style="margin-right: 10px;"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/search--v1.png" alt="search--v1"/></span>
          <input type="text" placeholder="Buscar" class="search-input" />
        </div>
        <button class="icon-btn"><img width="24" height="24" src="https://img.icons8.com/material-outlined/24/like--v1.png" alt="like--v1"/></button>
        <router-link to="/carrito" class="icon-btn" aria-label="Ver carrito">
          <img width="24" height="24" src="https://img.icons8.com/small/32/shopping-bag.png" alt="shopping-bag"/>
        </router-link>
        <div class="menu-perfil">
          <button @click="toggleDropdown" class="icon-btn profile">
            <img width="24" height="24" src="https://img.icons8.com/color/48/user-male-circle--v1.png" alt="user-male-circle--v1"/>
          </button>
          <div v-if="isDropdownOpen" class="dropdown-content">
            <router-link to="/perfil" class="menu-item" @click="isDropdownOpen = false">Configurar cuenta</router-link>
            <a href="#" @click.prevent="logout" class="menu-item logout-link">Cerrar sesión</a>
          </div>
        </div>
        <!--<button class="icon-btn profile"><img width="24" height="24" src="https://img.icons8.com/color/48/user-male-circle--v1.png" alt="user-male-circle--v1"/></button> -->
      </div>
    </header>
  </div>
  <div class="header-spacer" aria-hidden="true"></div>
</template>

<script>
import router from '@/router'; 

export default {
  data() {
    return {
      isDropdownOpen: false, // Controla la visibilidad del menú
    };
  },
  methods: {
    toggleDropdown() {
      // Alterna el estado del menú
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      // 1. Borrar el token del Local Storage (CERRAR SESIÓN)
      localStorage.removeItem('accessToken');
      
      // Opcional: Borrar cualquier otro dato de usuario
      localStorage.removeItem('user'); 

      // 2. Cerrar el menú
      this.isDropdownOpen = false;

      // 3. Redirigir al login (usando replace para limpiar el historial)
      console.log('Cerrando sesión. Redirigiendo a Login.');
      router.replace({ name: 'login' });
    }
  }
}
</script>





<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

.container {
  width: 100%;
  background-color: #ffffff;
}

/* Make header fixed at top */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-spacer {
  height: 72px; /* matches header approximate height */
  width: 100%;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #666666;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: #f9f9f9;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  width: 200px;
  font-size: 14px;
  color: #333333;
}

.search-input::placeholder {
  color: #999999;
}

.search-icon {
  font-size: 16px;
  cursor: pointer;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.profile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .nav {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 120px;
  }

  .nav {
    display: none;
  }
}

/* Increase spacer height for stacked header on small screens */
@media (max-width: 768px) {
  .header-spacer {
    height: 140px;
  }
}


.menu-perfil {
  position: relative; /* Contenedor para posicionar el dropdown relativo al botón */
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%; /* Coloca el menú justo debajo del botón */
  right: 0;
  background-color: #ffffff;
  min-width: 180px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); /* Sombra más suave */
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  border-radius: 4px;
  padding: 5px 0;
  margin-top: 5px; /* Pequeño espacio entre el botón y el menú */
}

.menu-item {
  color: #333333;
  padding: 10px 15px;
  text-decoration: none;
  display: block;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.logout-link {
    font-weight: 600; /* Resalta el botón de cerrar sesión */
    color: #e53935; /* Opcional: Color de alerta para cerrar sesión */
}
</style>
