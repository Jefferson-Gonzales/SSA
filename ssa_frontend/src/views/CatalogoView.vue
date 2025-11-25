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

      <section class="products-section" ref="productsSectionRef">
        <!-- Título del Catálogo Dinámico -->
        <h2 class="products-title">
            {{ isPersonalized ? '✨ Productos Recomendados para Ti' : '🛒 Catálogo Completo' }}
        </h2>

        <div v-if="loading" class="loading-message">Cargando productos...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="productos.length === 0" class="no-productos-message">No se encontraron productos con los filtros seleccionados.</div>

        <div v-else class="products-grid">
          <div class="product-card" v-for="producto in paginatedProducts" :key="producto.idproducto" @click="openProduct(producto)">
             <!-- INDICADOR DE RECOMENDACIÓN (NUEVO) -->
                <div v-if="isPersonalized && producto.score > 0" class="recommendation-badge">
                    <span class="score-display">{{ producto.score }}</span>
                    Recomendado
                </div>


            <button 
                class="favorite-indicator" 
                :class="{ 
                    'favorite-active': favoriteStatuses[producto.idproducto], 
                    'favorite-inactive': !favoriteStatuses[producto.idproducto] 
                }"
                @click.stop.prevent="toggleFavorite(producto)"
                :disabled="!producto.idproducto"
                aria-label="Añadir a favoritos"
            >
                </button>
            
            <div class="product-image">
              <img :src="producto.imagenUrl" class="product-image" />
            </div>
            <h3 class="product-name">{{ producto.nombre }}</h3>
            <p class="product-price">S/. {{ parseFloat(producto.precioBase).toFixed(2) }}</p>
            <div class="btn-container">
              <!-- Llamada a la nueva función addToCart, se pasa el producto completo -->
              <button class="btn-agregar" @click.stop="addToCart(producto)">Añadir al Carrito</button>
            </div>

          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">‹</button>
          <template v-for="item in visiblePages" :key="String(item)">
            <button
              v-if="typeof item === 'number'"
              class="pagination-btn"
              :class="{ 'active': item === currentPage }"
              @click="goToPage(item)"
            >
              {{ item }}
            </button>
            <span v-else class="pagination-ellipsis">…</span>
          </template>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">›</button>
        </div>
      </section>
    </div>
    <FloatingAssistantButton />

    <ToastMessage ref="cartToast" :message="toastMessage" :type="toastType" />

    <!-- Modal de Confirmación de Producto Añadido (Recomendado sobre alert()) -->
    <div v-if="showSuccessMessage" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
              <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
            </svg>
            <h3 class="text-lg font-bold mb-2 text-gray-800">¡Producto Añadido!</h3>
            <p class="text-sm text-gray-600">El artículo ha sido agregado a tu carrito.</p>
            <button @click="showSuccessMessage = false" class="btn-cerrar">
                Cerrar
            </button>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'; 
import apiClient from '@/services/api'; // Cliente para productos 
import axios from 'axios';
import { useRouter } from 'vue-router';
import FloatingAssistantButton from '@/components/FloatingAssistantButton.vue';
import ToastMessage from '@/components/ToastMessage.vue';

const productsSectionRef = ref(null);

// --- Constantes de localStorage ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';
const LOCAL_FAVORITES_KEY = 'SAGA_FAVORITES'; // ⭐ NUEVO: favoritos en localStorage

const isPersonalized = ref(false);
const productos = ref([]);
const pageSize = 12;
const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(productos.value.length / pageSize)));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return productos.value.slice(start, start + pageSize);
});

const maxPageButtons = 7;
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const maxButtons = maxPageButtons;
  if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  const side = Math.floor((maxButtons - 3) / 2);
  let start = Math.max(2, current - side);
  let end = Math.min(total - 1, current + side);

  const needed = (maxButtons - 2) - (end - start + 1);
  if (needed > 0) {
    if (start > 2) {
      start = Math.max(2, start - needed);
    } else if (end < total - 1) {
      end = Math.min(total - 1, end + needed);
    }
  }

  pages.push(1);
  if (start > 2) pages.push('left-ellipsis');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('right-ellipsis');
  pages.push(total);
  return pages;
});

const categorias = ref([]);
const loading = ref(true);
const error = ref(null);
const showSuccessMessage = ref(false);

// Filtros
const selectedCategoria = ref(null);
const minPrice = ref(0); 
const maxPrice = ref(100000); 
const sortBy = ref('relevante');
const MAX_PRICE_SLIDER = 1000; 

// ⭐ Estados de favoritos
const favoriteStatuses = ref({}); 
const API_BASE_URL = 'http://localhost:8080/api';

// Toast
const toastMessage = ref('');
const toastType = ref('success');
const cartToast = ref(null);

const showToast = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  if (cartToast.value) {
    cartToast.value.show();
  }
};

const scrollToProductsTop = async () => {
  // Espera a que la página/paginación termine de renderizar
  await nextTick();

  if (!productsSectionRef.value) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  // Si tienes un header fijo, obtenemos su altura
  // Ajusta el selector a lo que uses en tu HeaderNav (por ejemplo .header-nav, .main-header, etc.)
  const headerEl = document.querySelector('header') || document.querySelector('.header-nav');
  const headerHeight = headerEl ? headerEl.offsetHeight : 0;

  const rect = productsSectionRef.value.getBoundingClientRect();
  const offsetTop = rect.top + window.pageYOffset - headerHeight - 16; // margen extra

  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth',
  });
};

// ===============
// FAVORITOS: helpers localStorage
// ===============
const loadFavoritesFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(id => parseInt(id, 10))
      .filter(id => !Number.isNaN(id));
  } catch (e) {
    console.error('Error leyendo favoritos de localStorage:', e);
    return [];
  }
};

const saveFavoritesToStorage = (ids) => {
  try {
    const clean = Array.from(new Set(
      ids
        .map(id => parseInt(id, 10))
        .filter(id => !Number.isNaN(id))
    ));
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(clean));
  } catch (e) {
    console.error('Error guardando favoritos en localStorage:', e);
  }
};

// ===============
// FAVORITOS: sincronización con backend
// ===============
const checkFavoriteStatus = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    // 👉 Si no hay token, NO tocamos favoriteStatuses.
    // Usaremos solo lo que venga de localStorage.
    return; 
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/favoritos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const raw = response.data;

    if (!Array.isArray(raw)) {
      console.warn('Respuesta de /favoritos no es un array, recibido:', raw);
      return;
    }

    // Normalizar a lista de IDs numéricos
    const favoriteIds = raw
      .map(item => {
        if (typeof item === 'number') return item;
        if (typeof item === 'string') return parseInt(item, 10);
        if (item && typeof item === 'object') {
          return (
            item.idProducto ??
            item.idproducto ??
            item.productId ??
            item.id
          );
        }
        return null;
      })
      .filter(id => id !== null && !Number.isNaN(id))
      .map(id => parseInt(id, 10));


    const newStatuses = { ...favoriteStatuses.value };

    productos.value.forEach(p => {
      if (!p || p.idproducto == null) return;
      const pid = parseInt(p.idproducto, 10);
      newStatuses[pid] = favoriteIds.includes(pid);
    });

    favoriteStatuses.value = newStatuses;

    // También sincronizamos los IDs en localStorage (para que otras vistas lo vean igual)
    saveFavoritesToStorage(favoriteIds);

  } catch (error) {
    console.error("Error al verificar el estado de favoritos:", error);
    // Si hay error, no tocamos favoriteStatuses para no romper UI
  }
};

// ===============
// TOGGLE FAVORITO
// ===============
const toggleFavorite = async (producto) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    showToast('Debes iniciar sesión para marcar productos como favoritos.', 'error');
    setTimeout(() => router.push('/login'), 1500);
    return;
  }
  
  const productId = producto.idproducto;
  const currentStatus = !!favoriteStatuses.value[productId];

  // Optimistic UI
  const newStatuses = { ...favoriteStatuses.value };
  newStatuses[productId] = !currentStatus;
  favoriteStatuses.value = newStatuses;

  let toastMessageText = '';
  let toastMessageType = '';

  if (newStatuses[productId]) {
    toastMessageText = `"${producto.nombre}" añadido a tus favoritos.`;
    toastMessageType = 'success';
  } else {
    toastMessageText = `"${producto.nombre}" eliminado de tus favoritos.`;
    toastMessageType = 'remove';
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await axios.post(
      `${API_BASE_URL}/favoritos`, 
      { idProducto: parseInt(productId, 10) }, 
      { headers }
    );

    showToast(toastMessageText, toastMessageType);

    // Si backend devuelve isFavorite, lo usamos como verdad final
    if (response.data && typeof response.data.isFavorite === 'boolean') {
      const finalStatuses = { ...favoriteStatuses.value };
      finalStatuses[productId] = response.data.isFavorite;
      favoriteStatuses.value = finalStatuses;
    }

    // 🔁 Sincronizar lista en localStorage después del cambio
    const stored = loadFavoritesFromStorage();
    const pid = parseInt(productId, 10);
    let updatedIds;
    if (favoriteStatuses.value[productId]) {
      // Añadir si no está
      updatedIds = [...stored, pid];
    } else {
      // Quitar si está
      updatedIds = stored.filter(id => id !== pid);
    }
    saveFavoritesToStorage(updatedIds);

    // Para otras vistas
    localStorage.setItem('favoritesChanged', Date.now().toString());

    // 🔔 **AQUÍ AVISAMOS AL HEADER**
    window.dispatchEvent(new CustomEvent('saga:favorites-updated'));

  } catch (error) {
    console.error("Error al gestionar favorito:", error);
    alert('Hubo un error al actualizar tus favoritos. Inténtalo de nuevo.');
    
    // Revertir si falla
    const revertStatuses = { ...favoriteStatuses.value };
    revertStatuses[productId] = currentStatus;
    favoriteStatuses.value = revertStatuses;
  }
};

// ===============
// CARRITO
// ===============
const loadCart = () => {
  try {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error al cargar el carrito de localStorage:", error);
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
};

const addToCart = (producto) => {
  const currentCart = loadCart();
  const uniqueId = producto.idproducto;
  const existingItemIndex = currentCart.findIndex(item => item.id === uniqueId);

  if (existingItemIndex !== -1) {
    currentCart[existingItemIndex].quantity += 1;
  } else {
    const newItem = {
      id: uniqueId,
      name: producto.nombre,
      price: parseFloat(producto.precioBase),
      quantity: 1,
      image: producto.imagenUrl,
      size: 'N/A',
    };
    currentCart.push(newItem);
  }

  saveCart(currentCart);
  window.dispatchEvent(new CustomEvent('saga:cart-updated'));

  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 2500);
};

// ===============
// CARGA DE DATOS
// ===============
const fetchCategorias = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/categorias/categorias'); 
    categorias.value = [{ idcategoria: null, nombre: 'Todas las Categorías' }, ...response.data];
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
};

const fetchProductos = async () => {
  loading.value = true;
  error.value = null;
  currentPage.value = 1;

  const token = localStorage.getItem('accessToken');
  let endpoint = '/productos';
  const headers = {};
  isPersonalized.value = false;

  if (token) {
    endpoint = '/productos/personalizados';
    headers.Authorization = `Bearer ${token}`;
    isPersonalized.value = true;
  }

  const params = {
    idCategoria: selectedCategoria.value, 
    precioMin: minPrice.value,
    precioMax: maxPrice.value,
  };
  
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  try {
    const response = await apiClient.get(endpoint, { params });
    let data = response.data;

    if (sortBy.value === 'menor-precio') {
      data.sort((a, b) => a.precioBase - b.precioBase);
    } else if (sortBy.value === 'mayor-precio') {
      data.sort((a, b) => b.precioBase - a.precioBase);
    }
    
    productos.value = data;

    // 1️⃣ Inicializar estados a partir de localStorage (para que sobrevivan al F5)
    const storedFavIds = loadFavoritesFromStorage();
    const initialStatuses = {};
    productos.value.forEach(p => {
      if (p && p.idproducto != null) {
        const pid = parseInt(p.idproducto, 10);
        initialStatuses[pid] = storedFavIds.includes(pid);
      }
    });
    favoriteStatuses.value = initialStatuses;

    // 2️⃣ Si hay backend de favoritos, reforzar/actualizar
    await checkFavoriteStatus();

  } catch (err) {
    console.error("Error al cargar productos:", err);
    if (err.response && err.response.status === 401) {
      error.value = "Sesión expirada. Por favor, vuelva a iniciar sesión.";
    } else {
      error.value = "No se pudieron cargar los productos. Inténtalo más tarde.";
    }
  } finally {
    loading.value = false;
    scrollToProductsTop();
  }
};

// ===============
// WATCHERS
// ===============
watch([selectedCategoria, minPrice, maxPrice, sortBy], () => {
  fetchProductos();
});

watch(totalPages, (n) => {
  if (currentPage.value > n) currentPage.value = n;
});

const goToPage = (p) => {
  currentPage.value = p;
  scrollToProductsTop();
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
  scrollToProductsTop();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
  scrollToProductsTop();
};

// ===============
// CICLO DE VIDA
// ===============
onMounted(() => {
  fetchCategorias();
  fetchProductos();
});

const router = useRouter();

const openProduct = (product) => {
  const productId = product?.idproducto;
  if (productId) {
    router.push({ 
      name: 'detalle', 
      params: { id: productId } 
    });
  } else {
    console.error("Error de navegación: El objeto de producto no tiene el campo 'idProducto'.", product);
    alert('No se pudo cargar la información del producto. Inténtalo de nuevo.');
  }
};
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
  position: relative;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* 💡 ESTILOS NUEVOS PARA EL INDICADOR DE RECOMENDACIÓN */
.recommendation-badge {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #AAD500; /* Color verde de la marca */
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
}

.score-display {
    background-color: rgba(0, 0, 0, 0.15);
    padding: 1px 4px;
    border-radius: 3px;
    line-height: 1;
}


/* 💡 NUEVOS ESTILOS PARA EL INDICADOR DE FAVORITO */
.favorite-indicator {
    /* Estilos base del círculo */
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

/* Estado: AÑADIDO A FAVORITOS (El color que ya tienes: rgb(161, 120, 120)) */
.favorite-active {
    background-color: rgb(109, 212, 95);
}

/* Estado: NO ESTÁ EN FAVORITOS (Gris) */
.favorite-inactive {
    background-color: #d0d0d0; /* Un gris claro */
}

.favorite-indicator:hover {
    transform: scale(1.1);
}

/* Puedes eliminar los estilos anteriores del icono de corazón si ya no lo usas */
/* Si mantienes el icono dentro del círculo, puedes darle el color blanco: */
/*
.favorite-indicator i {
    color: white; 
    font-size: 18px;
}
*/
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

.pagination-btn.active {
  background-color: #AAD500;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
}

.pagination-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #666;
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
.btn-container {
  display: flex;
  justify-content: center;
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
}

/* Nota sobre el modal:
   Las clases del modal (fixed inset-0 bg-gray-600...) asumen que estás usando Tailwind CSS.
   Si no usas Tailwind, estas clases no funcionarán y tendrás que definir un CSS similar:*/
   
   .fixed { position: fixed; }
   .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
   .bg-gray-600 { background-color: #4b5563; }
   .bg-opacity-50 { background-color: rgba(75, 85, 99, 0.5); }
   .flex, .items-center, .justify-center { display: flex; align-items: center; justify-content: center; }
   .z-50 { z-index: 50; }
   
   /*Y para el contenido del modal:*/
   .bg-white { background-color: white; }
   .p-6 { padding: 1.5rem; }
   .rounded-lg { border-radius: 0.5rem; }
   .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
   .max-w-sm { max-width: 24rem; }
   .w-full { width: 100%; }
   .text-center { text-align: center; }

.btn-cerrar {
  width: 100%;
  background-color: #22c55e;
  color: white;
  font-weight: 600;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
</style>
