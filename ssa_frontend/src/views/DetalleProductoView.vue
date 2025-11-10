<template>
  <div class="product-details-container">
    
    <div v-if="isLoading" class="loading-state">
      <p>Cargando detalle del producto...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <h1>¡Ups! No pudimos cargar el producto.</h1>
      <p>{{ error }}</p>
      <p>Asegúrate de que tu servidor Spring Boot esté corriendo en `http://localhost:8080`.</p>
    </div>

    <template v-else-if="product">
      
      <div class="product-image-display">
        <div class="main-image">
          <img 
            :src="product.imagenUrl || 'https://placehold.co/800x800/e8e8e8/777777?text=SIN+IMAGEN'" 
            :alt="product.nombre"
            onerror="this.onerror=null;this.src='https://placehold.co/800x800/e8e8e8/777777?text=SIN+IMAGEN';"
          />
        </div>
        </div>

      <div class="product-info">
        
        <h1>{{ product.nombre }}</h1>
        <span class="text-sm font-medium text-gray-500 uppercase">{{ product.marca }}</span>
        
        <div class="price-section">
            <span class="price">S/{{ product.precioBase.toFixed(2) }}</span>
            </div>
          
        <p class="description">{{ product.descripcion }}</p>
          
        <div class="rating">
          <span class="stars">{{ formattedRating }}</span>
          <span class="review-count">({{ product.numeroResenas }} Reseñas)</span>
        </div>
        
        <div class="quantity-selector">
          <label>Cantidad (Stock: {{ product.stockActual }}):</label>
          <div class="quantity-control">
            <button @click="decrementQuantity" :disabled="quantity <= 1 || product.stockActual === 0">−</button>
            <input 
              v-model.number="quantity" 
              type="number" 
              min="1" 
              :max="product.stockActual" 
              :disabled="product.stockActual === 0"
            />
            <button @click="incrementQuantity" :disabled="quantity >= product.stockActual || product.stockActual === 0">+</button>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            class="add-to-cart-btn" 
            @click="addToCart" 
            :disabled="product.stockActual === 0 || quantity === 0"
          >
            {{ product.stockActual === 0 ? 'Agotado' : 'Agregar al carrito' }}
          </button>
          <button class="wishlist-btn" @click="toggleWishlist">
            ♡
          </button>
        </div>

        <div class="details-section">
          <h3>Detalles del Producto</h3>
          <ul>
            <li><strong>Categoría:</strong> {{ product.categoria.nombre }}</li>
            <li><strong>Stock Total:</strong> {{ product.stockActual }}</li>
            <li><strong>SKU:</strong> {{ product.sku }}</li> 
          </ul>
        </div>

        <div class="shipping-section">
          <div class="shipping-item">
            <span class="icon">🚚</span>
            <span>Envío gratuito en pedidos superiores a 50 soles.</span>
          </div>
          <div class="shipping-item">
            <span class="icon">↩️</span>
            <span>Devoluciones fáciles en 30 días</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import { useRoute } from 'vue-router';    
import axios from 'axios';

// Se ELIMINA la definición de emptyVariant
// Se ELIMINA la definición de emptyProduct (comentada)

// --- Estados Reactivos ---
const route = useRoute();
const product = ref(null);
// Se ELIMINA selectedVariant
const quantity = ref(1);
// Se ELIMINA mainImage (usaremos product.imagenUrl directamente en el template)
const isLoading = ref(true);
const error = ref(null);

const API_URL = 'http://localhost:8080/api/productos/'; 
const productId = computed(() => route.params.id);

// --- Lógica Computada Simplificada ---

// Se ELIMINA productImages

// Se ELIMINA finalPrice

/**
 * Formatea la calificación promedio como estrellas (simple).
 */
const formattedRating = computed(() => {
  if (!product.value || product.value.calificacionPromedio == null) return '☆☆☆☆☆';
  const rating = Math.round(product.value.calificacionPromedio);
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
});


// --- Funciones de Fetching y Lógica ---

/**
 * Realiza la llamada a la API para obtener el detalle del producto.
 */
const fetchProductDetail = async (id) => {
  isLoading.value = true;
  error.value = null;
  product.value = null;

  if (!id) {
    error.value = 'ID de producto no proporcionado en la URL.';
    isLoading.value = false;
    return;
  }
  
  try {
    const response = await axios.get(`${API_URL}${id}`);
    product.value = response.data;
    // Asumimos que product.sku existe
    product.value.sku = product.value.sku || 'N/A'; 
    
    // Inicializar la cantidad: si hay stock, 1; si no, 0.
    if (product.value.stockActual < 1) {
        quantity.value = 0;
    } else {
        quantity.value = 1;
    }
    
  } catch (err) {
    console.error("Error fetching product detail:", err);
    if (err.response && err.response.status === 404) {
          error.value = `Producto no encontrado (ID: ${id}).`;
    } else {
        error.value = 'Ocurrió un error al conectar con el servidor o la API está caída.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Se ELIMINA selectVariant

/**
 * Lógica para añadir al carrito (usando stock general).
 */
const addToCart = () => {
  // Ahora solo usa el stock y nombre del producto principal
  if (product.value.stockActual > 0 && quantity.value > 0 && quantity.value <= product.value.stockActual) {
    alert(`Añadido ${quantity.value}x ${product.value.nombre} al carrito.`);
  } else {
    alert('No se puede agregar. La cantidad no es válida o el producto está agotado.');
  }
};

const toggleWishlist = () => {
    alert('Agregado a lista de deseos!');
};

const incrementQuantity = () => {
    // Usar stockActual
    if (quantity.value < product.value.stockActual) {
        quantity.value++;
    }
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// --- Ciclo de Vida ---

// Ejecutar el fetch al cargar el componente
onMounted(() => {
    if (productId.value) {
        fetchProductDetail(productId.value);
    } else {
        error.value = 'Ruta inválida: Falta el ID del producto.';
        isLoading.value = false;
    }
});

// Observar el ID de la ruta por si se navega entre productos
watch(productId, (newId) => {
    if (newId) {
        fetchProductDetail(newId);
    }
});
</script>

<style scoped>
/* Estilos existentes */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-details-container {
  display: flex;
  gap: 40px;
  padding: 40px;
  margin: 0 auto;
  max-width: 1200px; 
  background-color: #f9f9f9;
}

/* Manejo de Estado */
.loading-state, .error-state {
    padding: 40px;
    text-align: center;
    background-color: white;
    margin: 20px auto;
    border-radius: 10px;
    max-width: 600px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.error-state h1 { color: #d9534f; margin-bottom: 10px; }

/* Product Image Display (Se renombra para mayor claridad) */
.product-image-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* Se ELIMINA .product-gallery y se sustituye por .product-image-display */

.main-image {
  width: 100%;
  height: auto; 
  aspect-ratio: 4/5; 
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

/* Se ELIMINA .thumbnail-gallery, .thumbnail y .thumbnail.active */

/* Product Info */
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-info h1 {
  font-size: 32px;
  font-weight: bold;
  color: #1a1a1a;
}

.rating {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stars {
  color: #FFB800;
  font-size: 18px;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.price-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.price {
  font-size: 30px;
  font-weight: bold;
  color: #C5E01B;
}

/* Se ELIMINA .original-price */

.description {
  color: #666;
  line-height: 1.6;
  font-size: 15px;
  text-align: left;
}

/* Se ELIMINAN .size-selector, .color-selector, .size-options, .size-btn y sus estados */

/* Quantity Selector */
.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.quantity-selector label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: fit-content;
}

.quantity-control button {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background 0.3s;
}

.quantity-control button:hover:not(:disabled) {
  background-color: #f0f0f0;
}
.quantity-control button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.quantity-control input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.quantity-control input::-webkit-outer-spin-button,
.quantity-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
}

.add-to-cart-btn {
  flex: 1;
  padding: 16px;
  background-color: #C5E01B;
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #b3d00f;
}

.add-to-cart-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.wishlist-btn {
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  border-color: #C5E01B;
  color: #C5E01B;
}

/* Details Section */
.details-section {
  padding-top: 24px;
  border-top: 1px solid #ddd;
  text-align: left;
}

.details-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.details-section ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.details-section li {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.details-section strong {
  color: #1a1a1a;
}

/* Shipping Section */
.shipping-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #ddd;
}

.shipping-item {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.shipping-item .icon {
  font-size: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-details-container {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
  }

  .product-info h1 {
    font-size: 24px;
  }

  .price {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .wishlist-btn {
    width: 100%;
  }
}
</style>