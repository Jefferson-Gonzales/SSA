<template>
  <div class="favoritos-view container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">⭐ Tus Productos Favoritos</h1>

    <div v-if="loading" class="text-center py-20">
      <p class="text-lg text-gray-600">Cargando tus productos favoritos...</p>
    </div>
    
    <div v-else-if="favoriteProducts.length === 0" class="text-center p-12 my-10 border-2 border-dashed border-gray-300 rounded-xl bg-white shadow-lg">
      <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      <p class="text-xl text-gray-700 font-semibold mb-4">¡Tu lista de favoritos está vacía!</p>
      <p class="text-gray-600 mb-6">Empieza a explorar nuestros productos y usa el icono del corazón para guardar tus artículos.</p>
      <router-link to="/catalogo" class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-full transition duration-300 shadow-md">
        Ir al Catálogo
      </router-link>
    </div>

    <div v-else>
      <div class="products-grid">
        <div class="product-card" 
             v-for="product in favoriteProducts" 
             :key="product.idproducto" 
             @click="$router.push({ name: 'detalle', params: { id: product.idproducto } })"
        >
            <button 
                class="favorite-indicator favorite-active" 
                @click.stop.prevent="toggleFavorite(product.idproducto)"
            >
                <i class="fas fa-heart" aria-hidden="true"></i>
            </button>

            <div class="product-image">
                 <img :src="product.imagenUrl" class="product-image" />
            </div>
            
            <h3 class="product-name">{{ product.nombre }}</h3>
            <p class="product-price">S/. {{ parseFloat(product.precioBase).toFixed(2) }}</p>
            
            <div class="btn-container">
                <button class="btn-agregar" @click.stop="addToCart(product)">Añadir al Carrito</button>
            </div>
        </div>
        </div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8" role="alert">
      <strong class="font-bold">Error al cargar:</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8080/api';

// const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART'; 

const LOCAL_FAVORITES_KEY = 'SAGA_FAVORITES';

export default {
  name: 'FavoritosView',

  data() {
    return {
      favoriteProducts: [], 
      loading: false,
      error: null,
      lastFavoriteChange: localStorage.getItem('favoritesChanged'), 
    };
  },
  created() {
    this.fetchFavoriteProducts();
  },
  mounted() {
        //  Listener para recargar cuando la pestaña vuelve a estar visible
        window.addEventListener('focus', this.handleFocus);
    },
    unmounted() {
        // Limpiamos el listener
        window.removeEventListener('focus', this.handleFocus);
        },
  methods: {

    // Nueva función para manejar el regreso a la pestaña
    handleFocus() {
        const currentChangeTime = localStorage.getItem('favoritesChanged');
        // Si el tiempo de cambio es diferente al que cargamos, recargamos la lista
        if (currentChangeTime && currentChangeTime !== this.lastFavoriteChange) {
            console.log("Detectado cambio de favoritos desde otra vista. Recargando...");
            this.lastFavoriteChange = currentChangeTime;
            this.fetchFavoriteProducts();
        }
    },

    /** * Obtiene la lista de productos favoritos desde el backend. */
    async fetchFavoriteProducts() {
      this.loading = true;
      this.error = null;
      
      const token = localStorage.getItem('accessToken');

      if (!token) {
        this.$router.push('/login');
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Llama al endpoint del backend que devuelve los detalles completos
        const response = await axios.get(`${API_BASE_URL}/favoritos`, { headers });

        this.favoriteProducts = response.data;
        
      } catch (err) {
        console.error("Error al cargar productos favoritos:", err);
        
        if (err.response && err.response.status === 401) {
            //this.error = "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.";
        } else {
            //this.error = "Hubo un problema al conectar con el servidor para obtener tus favoritos.";
        }
        this.favoriteProducts = [];
      } finally {
        this.loading = false;
      }
    },

    loadFavoritesFromStorage() {
      try {
        const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
          .map(id => parseInt(id, 10))
          .filter(id => !Number.isNaN(id));
      } catch (e) {
        console.error('Error leyendo favoritos de localStorage en FavoritosView:', e);
        return [];
      }
    },
    saveFavoritesToStorage(ids) {
      try {
        const clean = Array.from(
          new Set(
            ids
              .map(id => parseInt(id, 10))
              .filter(id => !Number.isNaN(id))
       )
     );
     localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(clean));
    } catch (e) {
      console.error('Error guardando favoritos en localStorage en FavoritosView:', e);
    }
  },
    
    /** * Función para ELIMINAR el producto de favoritos */
    async toggleFavorite(productId) {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.$router.push('/login'); 
            return;
        }

        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // Llama al POST de TOGGLE (el endpoint que usa tu backend para eliminar/añadir)
            await axios.post(`${API_BASE_URL}/favoritos`, 
                { idProducto: parseInt(productId, 10) }, 
                { headers }
            );

            // Actualizar storage local también
            const stored = this.loadFavoritesFromStorage();
            const updated = stored.filter(id => id !== parseInt(productId, 10));
            this.saveFavoritesToStorage(updated);


            //  CLAVE DE SINCRONIZACIÓN: Notificar que se ha cambiado la lista global
            localStorage.setItem('favoritesChanged', Date.now().toString());

            window.dispatchEvent(new CustomEvent('saga:favorites-updated'));
            
            // Una vez eliminado con éxito, recargamos la lista para que el producto desaparezca
            this.fetchFavoriteProducts(); 
            
        } catch (error) {
            console.error("Error al eliminar favorito:", error);
            alert('No se pudo eliminar el producto de favoritos. Inténtalo de nuevo.');
        }
    },

    /** * Lógica simplificada para añadir al carrito (DEBES IMPLEMENTAR LA LÓGICA COMPLETA) */
    addToCart(producto) {
        // lógica para cargar, modificar y guardar el carrito en localStorage.
        alert(`Producto ${producto.nombre} añadido al carrito.`);
    },
  }
};
</script>

<style scoped>
/* --- ESTILOS GENERALES Y LAYOUT --- */
.container {
    max-width: 1200px;
    margin: 0 auto;
}
.products-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr); /* Default 1 columna */
    gap: 24px;
    margin-bottom: 40px;
}
/* Media queries para la cuadrícula */
@media (min-width: 640px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr); /* sm: 2 columnas */
    }
}
@media (min-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr); /* lg: 3 columnas */
    }
}
@media (min-width: 1280px) {
    .products-grid {
        grid-template-columns: repeat(4, 1fr); /* xl: 4 columnas */
    }
}

/* --- ESTILOS DE LA TARJETA (product-card) --- */
.product-card {
    position: relative; 
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 250px;
    background-color: #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-name {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    padding: 12px 12px 8px;
}

.product-price {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    padding: 0 12px 12px;
}

/* --- ESTILOS DE BOTONES --- */
.btn-container {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
}

.btn-agregar {
    background-color: #AAD500;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
    transition: background-color 0.2s;
}
.btn-agregar:hover {
    background-color: #9ac200; 
}

/* Estilos para el Icono de Favorito (Crucial) */
.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: transform 0.2s;
}

.favorite-icon i {
    font-size: 18px;
}

/* Botón de favorito en vista de Favoritos (mismo estilo que catálogo) */
.favorite-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: background-color 0.3s ease, transform 0.2s;
}

.favorite-active {
  background-color: rgb(109, 212, 95); /* verde activo */
}

.favorite-indicator:hover {
  transform: scale(1.1);
}

.favorite-indicator i {
  color: white;          /* corazón blanco */
  font-size: 18px;
}


/* Colores */
.text-gray-800 { color: #1a1a1a; }
.bg-yellow-400 { background-color: #C5E01B; }
.hover\:bg-yellow-500:hover { background-color: #b3d00f; } 
.text-red-500 { color: #e53e3e; } /* Rojo para el corazón lleno */
</style>