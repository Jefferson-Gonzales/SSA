<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <h1 class="logo">SAGASMART</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">Home</router-link>
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
        <button class="icon-btn profile"><img width="24" height="24" src="https://img.icons8.com/color/48/user-male-circle--v1.png" alt="user-male-circle--v1"/></button>
      </div>
    </header>
  </div>
</template>

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
</style>
