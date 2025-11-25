<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <h1 class="logo">SAGASMART</h1>
        <nav class="nav">
          <router-link to="/about" class="nav-link">Catalogo</router-link>
          <router-link to="/catalogo" class="nav-link">Catalogo Personalizado</router-link>
          <router-link to="/ofertas" class="nav-link">Ofertas</router-link>
        </nav>
      </div>

      <div class="header-right">
        <!-- 🔎 Buscador 
        <div class="search-bar">
          <span class="search-icon" style="margin-right: 10px;" @click="handleSearch">
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios-filled/50/search--v1.png"
              alt="search--v1"
            />
          </span>
          <input
            type="text"
            placeholder="Buscar"
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>-->

        <!-- ❤️ Favoritos con badge -->
        <div class="icon-wrapper">
          <router-link to="/Favoritos" class="icon-btn" aria-label="Ver favoritos">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-outlined/24/like--v1.png"
              alt="like--v1"
            />
          </router-link>
          <span v-if="favoritesCount > 0" class="icon-badge">
            {{ favoritesCount }}
          </span>
        </div>

        <!-- 🛍 Carrito con badge -->
        <div class="icon-wrapper">
          <router-link to="/carrito" class="icon-btn" aria-label="Ver carrito">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/small/32/shopping-bag.png"
              alt="shopping-bag"
            />
          </router-link>
          <span v-if="cartCount > 0" class="icon-badge">
            {{ cartCount }}
          </span>
        </div>

        <!-- 👤 Perfil -->
        <div class="menu-perfil" ref="profileMenu">
          <button @click="toggleDropdown" class="icon-btn profile">
            <img
             v-if="avatarUrl"
             :src="avatarUrl"
             alt="Avatar de usuario"
             class="profile-avatar-img"
           />
           <img
             v-else
             width="24"
             height="24"
             src="https://img.icons8.com/color/48/user-male-circle--v1.png"
             alt="user-male-circle--v1"
           />
          </button>

          <div v-if="isDropdownOpen" class="dropdown-content">
            <router-link
              to="/perfil"
              class="menu-item"
              @click="isDropdownOpen = false"
            >
              Configurar cuenta
            </router-link>
            <a href="#" @click.prevent="logout" class="menu-item logout-link">
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>
    </header>
  </div>
  <div class="header-spacer" aria-hidden="true"></div>
</template>

<script>
import router from '@/router';

const AVATAR_STORAGE_KEY_PREFIX = 'USER_AVATAR_';
const CURRENT_AVATAR_KEY = 'SAGA_CURRENT_AVATAR';

export default {
  data() {
    return {
      isDropdownOpen: false,
      searchQuery: '',
      favoritesCount: 0,
      cartCount: 0,
      avatarUrl: '',
    };
  },
  methods: {

    // 🔹 Obtener email del usuario logueado
    getCurrentUserEmail() {
      try {
        const rawUser = localStorage.getItem('user');
        if (!rawUser) return null;
        const userObj = JSON.parse(rawUser);
        return userObj.email || null;
      } catch (e) {
        console.error('Error leyendo user desde localStorage:', e);
        return null;
      }
    },

    // 🔹 Cargar avatar desde localStorage (o generar uno estable por email)
    syncAvatar() {
      // 1) Intentar leer el avatar global del usuario actual
      const currentAvatar = localStorage.getItem(CURRENT_AVATAR_KEY);
      if (currentAvatar) {
        this.avatarUrl = currentAvatar;
        return;
      }

      // 2) (Opcional) fallback por email, por si existe
      const email = this.getCurrentUserEmail();
      if (!email) {
        this.avatarUrl = null;
        return;
      }

      const storedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY_PREFIX + email);
      if (storedAvatar) {
        this.avatarUrl = storedAvatar;
      } else {
        // fallback: avatar determinista por email
        this.avatarUrl = `https://avatar.iran.liara.run/public?username=${encodeURIComponent(email)}`;
      }
    },


    toggleDropdown() {
      if (event) event.stopPropagation();
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    handleClickOutside(event) {
      // Si el menú NO está abierto, no hacemos nada
      if (!this.isDropdownOpen) return;

      const menuEl = this.$refs.profileMenu;
      // Si existe el ref y el clic fue FUERA del menú, lo cerramos
      if (menuEl && !menuEl.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },

    // 🔎 Buscar: redirige al catálogo con query en la URL
    handleSearch() {
      const q = this.searchQuery.trim();
      if (!q) return;

      router.push({
        path: '/catalogo', // ajusta si tu ruta es otra
        query: { search: q },
      });
    },

    // ✅ FAVORITOS: lee SAGA_FAVORITES de localStorage
    syncFavoritesCount() {
      try {
        const raw = localStorage.getItem('SAGA_FAVORITES');
        if (!raw) {
          this.favoritesCount = 0;
          return;
        }
        const parsed = JSON.parse(raw);
        this.favoritesCount = Array.isArray(parsed) ? parsed.length : 0;
      } catch (e) {
        console.error('Error leyendo SAGA_FAVORITES:', e);
        this.favoritesCount = 0;
      }
    },

    // ✅ CARRITO: lee SAGA_SHOPPING_CART de localStorage
    syncCartCount() {
      try {
        const raw = localStorage.getItem('SAGA_SHOPPING_CART');
        if (!raw) {
          this.cartCount = 0;
          return;
        }
        const parsed = JSON.parse(raw);
        this.cartCount = Array.isArray(parsed) ? parsed.length : 0;
      } catch (e) {
        console.error('Error leyendo SAGA_SHOPPING_CART:', e);
        this.cartCount = 0;
      }
    },

    // Sincroniza ambos contadores
    syncCounts() {
      this.syncFavoritesCount();
      this.syncCartCount();
    },

    // Escucha cambios en localStorage (entre tabs)
    handleStorageEvent(e) {
      if (e.key === 'SAGA_FAVORITES') {
        this.syncFavoritesCount();
      } else if (e.key === 'SAGA_SHOPPING_CART') {
        this.syncCartCount();
      } else if (e.key && e.key.startsWith(AVATAR_STORAGE_KEY_PREFIX)) {
        this.syncAvatar();
      }
    },

    logout() {
      let storageKey = 'chat_history_guest';
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const userObj = JSON.parse(rawUser);
          const userId = userObj.id || userObj.email || 'guest';
          storageKey = `chat_history_${userId}`;
        }
      } catch (e) {
        console.error('Error obteniendo user para limpiar chat:', e);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem(storageKey);

      this.isDropdownOpen = false;
      console.log('Cerrando sesión. Redirigiendo a Login.');
      router.replace({ name: 'login' });
    },
  },
  mounted() {
    // Inicializar contadores al cargar
    this.syncCounts();
    this.syncAvatar();

    // Escuchar eventos personalizados (misma pestaña)
    window.addEventListener('saga:favorites-updated', this.syncFavoritesCount);
    window.addEventListener('saga:cart-updated', this.syncCartCount);

    // Escuchar cambios en localStorage (otras pestañas)
    window.addEventListener('storage', this.handleStorageEvent);
    window.addEventListener('saga:avatar-updated', this.syncAvatar); 

    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    window.removeEventListener('saga:favorites-updated', this.syncFavoritesCount);
    window.removeEventListener('saga:cart-updated', this.syncCartCount);
    window.removeEventListener('storage', this.handleStorageEvent);
    document.removeEventListener('click', this.handleClickOutside);
  },
};
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
  height: 72px;
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

/* 🟡 Wrapper + badge de iconos */
.icon-wrapper {
  position: relative;
  display: inline-block;
}

.icon-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background-color: #c5e01b;
  color: #111827;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
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

@media (max-width: 768px) {
  .header-spacer {
    height: 140px;
  }
}

/* Menu perfil */
.menu-perfil {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  min-width: 180px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border-radius: 4px;
  padding: 5px 0;
  margin-top: 5px;
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
  font-weight: 600;
  color: #e53935;
}

.profile-avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

</style>
