<template>
  <div>
    <div class="main-content">
      <aside class="sidebar">
        <div class="filter-section">
          <h3 class="filter-title">Filtros</h3>
        </div>

        <div class="filter-section">
          <h4 class="filter-subtitle">Categorías</h4>
          <select v-model="selectedCategoria" class="filter-select">
            <option 
              v-for="cat in categorias" 
              :key="cat.idcategoria" 
              :value="cat.idcategoria"
            >
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-section">
          <h4 class="filter-subtitle">Rango de Precios</h4>
          <div class="price-range">
            <span>S/.{{ minPrice }}</span>
            <span>S/.{{ maxPrice }}</span>
          </div>
          
          <input type="range" :min="0" :max="maxPrice - 1" v-model.number="minPrice" class="range-slider">
          <input type="range" :min="minPrice + 1" :max="MAX_PRICE_SLIDER" v-model.number="maxPrice" class="range-slider" style="margin-top: 5px;">
        </div>
        
        <div class="filter-section">
          <h4 class="filter-subtitle">Ordenar Por</h4>
          <select v-model="sortBy" class="filter-select">
            <option value="relevante">Relevante</option>
            <option value="menor-precio">Precio: Menor a Mayor</option>
            <option value="mayor-precio">Precio: Mayor a Menor</option>
            <option value="mas-nuevo">Más Nuevo</option>
          </select>
        </div>
      </aside>

      <section class="products-section">
        <h2 class="products-title">Productos</h2>
        
        <div v-if="loading" class="loading-message">Cargando productos...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="productos.length === 0" class="no-productos-message">No se encontraron productos con los filtros seleccionados.</div>

        <div v-else class="products-grid">
          <div class="product-card" v-for="producto in productos" :key="producto.idproducto">
            <div class="product-image">
              <img :src="producto.imagenUrl || 'https://placehold.jp/250x250/e8e8e8/777777?text=SAGASMART'" :alt="producto.nombre">
            </div>
            <h3 class="product-name">{{ producto.nombre }}</h3>
            <p class="product-price">S/. {{ parseFloat(producto.precioBase).toFixed(2) }}</p>
            <button class="btn-agregar">Añadir al Carrito</button>
          </div>
        </div>

        <div class="pagination">
          </div>
      </section>
    </div>
    <FloatingAssistantButton />
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'; 
import apiClient from '@/services/api'; // Cliente para productos (requiere JWT)
import axios from 'axios';             // Usaremos axios directamente para la categoría (ruta pública)
import FloatingAssistantButton from '@/components/FloatingAssistantButton.vue';

// --- ESTADO Y FILTROS ---
const productos = ref([]);
const categorias = ref([]); // Lista dinámica de categorías
const loading = ref(true);
const error = ref(null);

// **ESTADOS DE FILTRO** (Valores iniciales)
const selectedCategoria = ref(null); // null = Todas las categorías
const minPrice = ref(0); 
const maxPrice = ref(100000); 
const sortBy = ref('relevante'); // Criterio de ordenación

// Rango máximo para el slider (ajusta según tus precios máximos reales)
const MAX_PRICE_SLIDER = 1000; 

// --- FUNCIONES DE CARGA DE DATOS ---

// 1. Cargar Categorías (Ruta pública)
const fetchCategorias = async () => {
    try {
        // Asumiendo que tu URL base es http://localhost:8080/ y Axios no tiene el baseURL
        // Si tu apiClient tiene baseURL configurada, úsalo, sino usa la URL completa
        const response = await axios.get('http://localhost:8080/api/categorias/categorias'); 
        
        // Añadir la opción "Todas las Categorías" al inicio
        categorias.value = [{ idcategoria: null, nombre: 'Todas las Categorías' }, ...response.data];
        console.log('Categorías cargadas:', categorias.value);
        
    } catch (err) {
        console.error("Error al cargar categorías:", err);
    }
};

// 2. Cargar Productos (Ruta protegida y filtrable)
const fetchProductos = async () => {
    loading.value = true;
    error.value = null;
    
    // Construimos los parámetros de la URL
    const params = {
        // El backend espera idCategoria
        idCategoria: selectedCategoria.value, 
        precioMin: minPrice.value,
        precioMax: maxPrice.value,
        // Mandamos el criterio de ordenación al backend (si lo implementamos allí)
        // sortBy: sortBy.value 
    };
    
    // Limpiamos parámetros nulos o por defecto
    Object.keys(params).forEach(key => {
        // No enviamos el filtro si es null o si el precio es el valor por defecto
        if (params[key] === null || params[key] === undefined) {
            delete params[key];
        }
    });

    try {
        // Usamos apiClient para enviar el JWT en el Header
        const response = await apiClient.get('/productos', { params }); 
        
        let data = response.data;

        // Si la ordenación es en el Frontend (porque sortBy no se manda al backend)
        if (sortBy.value === 'menor-precio') {
            data.sort((a, b) => a.precioBase - b.precioBase);
        } else if (sortBy.value === 'mayor-precio') {
            data.sort((a, b) => b.precioBase - a.precioBase);
        }
        
        productos.value = data;

    } catch (err) {
        console.error("Error al cargar productos:", err);
        if (err.response && err.response.status === 401) {
            error.value = "Sesión expirada. Por favor, vuelva a iniciar sesión.";
        } else {
             error.value = "No se pudieron cargar los productos. Inténtalo más tarde.";
        }
    } finally {
        loading.value = false;
    }
};

// --- WATCHERS: Recargar productos al cambiar los filtros ---
// El 'deep: true' no es necesario aquí, pero watch detectará los cambios en las referencias (ref)
watch([selectedCategoria, minPrice, maxPrice, sortBy], () => {
    // Si cambia cualquiera de estos valores, se llama a la API para refrescar los productos
    fetchProductos();
});

// --- CICLO DE VIDA ---
onMounted(() => {
    fetchCategorias(); // Cargar categorías primero
    fetchProductos();  // Luego cargar productos
});
</script>

<style scoped>
.main-content {
  display: flex;
  gap: 32px;
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  text-align: left;
}

/* Sidebar */
.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  cursor: pointer;
}

.price-range {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
}

.range-slider {
  width: 100%;
  cursor: pointer;
}

/* Products Section */
.products-section {
  flex: 1;
  text-align: left;
}

.products-title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 24px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.product-card {
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

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  background-color: #ffffff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #f0f0f0;
  border-color: #999999;
  border-radius: 5px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    gap: 24px;
  }

  .sidebar {
    width: 100%;
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .filter-section {
    flex: 1;
    min-width: 150px;
    margin-bottom: 0;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}


/* CatalogoView.vue (dentro de <style scoped>) */

/* Mensajes de estado */
.loading-message, .error-message, .no-productos-message {
    padding: 20px;
    text-align: center;
    font-size: 1.2em;
    color: #333;
}
.error-message {
    color: red;
    font-weight: bold;
}
.btn-agregar {
    /* Estilos del botón de tu respuesta anterior */
    background-color: #AAD500;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
}

/* ... (Asegúrate de que tus estilos .product-card y .products-grid se vean bien) */
</style>
