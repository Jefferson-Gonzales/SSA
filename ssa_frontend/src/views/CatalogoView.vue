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
          <div class="product-card" v-for="producto in paginatedProducts" :key="producto.idproducto" @click="openProduct(producto)">
            <div class="product-image">
              <img :src="producto.imagenUrl || 'https://placehold.jp/250x250/e8e8e8/777777?text=SAGASMART'" :alt="producto.nombre">
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
import { ref, onMounted, watch, computed } from 'vue'; 
import apiClient from '@/services/api'; // Cliente para productos (requiere JWT)
import axios from 'axios';             // Usaremos axios directamente para la categoría (ruta pública)
import { useRouter } from 'vue-router';
import FloatingAssistantButton from '@/components/FloatingAssistantButton.vue';

// --- Constante de localStorage ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';


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

const categorias = ref([]); // Lista dinámica de categorías
const loading = ref(true);
const error = ref(null);
const showSuccessMessage = ref(false);

// **ESTADOS DE FILTRO** (Valores iniciales)
const selectedCategoria = ref(null); // null = Todas las categorías
const minPrice = ref(0); 
const maxPrice = ref(100000); 
const sortBy = ref('relevante'); // Criterio de ordenación

// Rango máximo para el slider (ajusta según tus precios máximos reales)
const MAX_PRICE_SLIDER = 1000; 

// --- FUNCIONES DE MANEJO DEL CARRITO (NUEVAS) ---

/** * Carga el carrito desde localStorage. 
 * Formato esperado: [{ id: number, name: string, price: number, quantity: number, ... }]
 */
const loadCart = () => {
    try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
    }
};

/** Guarda el carrito actual en localStorage. */
const saveCart = (cart) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Error al guardar el carrito en localStorage:", error);
    }
};

/** * Añade un producto al carrito, manejando si ya existe o si es nuevo.
 * @param {Object} producto - El objeto producto de tu API.
 */
const addToCart = (producto) => {
    // 1. Cargar el carrito actual
    const currentCart = loadCart();

    // 2. Definir un ID único para el producto en el carrito. Usamos idproducto.
    const uniqueId = producto.idproducto;
    
    // 3. Buscar si el producto ya existe en el carrito
    const existingItemIndex = currentCart.findIndex(item => item.id === uniqueId);

    if (existingItemIndex !== -1) {
        // A. Si existe, solo incrementa la cantidad
        currentCart[existingItemIndex].quantity += 1;
        console.log(`Producto ${producto.nombre} encontrado. Cantidad incrementada.`);

    } else {
        // B. Si no existe, crea el nuevo objeto de item del carrito
        // Asegúrate de que el formato coincida con lo que espera CarritoView.vue
        const newItem = {
            id: uniqueId,                       // CLAVE CRUCIAL: 'id' (debe ser único)
            name: producto.nombre,              // CLAVE CRUCIAL: 'name'
            price: parseFloat(producto.precioBase), // CLAVE CRUCIAL: 'price' (como número)
            quantity: 1,                       // CLAVE CRUCIAL: 'quantity'
            image: producto.imagenUrl,          // CLAVE CRUCIAL: 'image'
            size: 'N/A',                       // CLAVE CRUCIAL: 'size' (o usa un valor real si aplica)
            // Puedes añadir más campos aquí si los necesitas
        };
        currentCart.push(newItem);
        console.log(`Producto ${producto.nombre} añadido por primera vez.`);
    }

    // 4. Guardar el carrito actualizado
    saveCart(currentCart);
    
    // 5. Mostrar un mensaje de éxito
    showSuccessMessage.value = true;
    setTimeout(() => {
        showSuccessMessage.value = false;
    }, 2500); // Ocultar el mensaje después de 2.5 segundos
};


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
  // resetear la página cuando se recargan los productos por cambios de filtro
  currentPage.value = 1;
    
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

watch(totalPages, (n) => {
  if (currentPage.value > n) currentPage.value = n;
});

const goToPage = (p) => {
  currentPage.value = p;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

// --- CICLO DE VIDA ---
onMounted(() => {
    fetchCategorias(); // Cargar categorías primero
    fetchProductos();  // Luego cargar productos
});

const router = useRouter();
/*const openProduct = (producto) => {
  router.push({ name: 'detalle-producto', query: { id: producto.idproducto } });
};*/

  const openProduct = (product) => {
    // 1. ASUMIENDO que el ID se llama 'idProducto' (basado en tus respuestas de API).
    const productId = product?.idproducto;

    // 2. VERIFICAR que el ID existe antes de navegar.
    if (productId) {
        // La navegación es segura.
        // Asegúrate de que 'detalle' sea el nombre de la ruta que acepta el parámetro ':id' en tu vue-router.
        router.push({ 
            name: 'detalle', 
            params: { id: productId } 
        });
    } else {
        // En caso de que el objeto product no tenga el ID, se imprime un error
        // y se muestra un mensaje amigable al usuario (en lugar de romper la app).
        console.error("Error de navegación: El objeto de producto no tiene el campo 'idProducto'.", product);
        // Opcional: Mostrar una notificación al usuario de que el producto no se puede ver.
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
