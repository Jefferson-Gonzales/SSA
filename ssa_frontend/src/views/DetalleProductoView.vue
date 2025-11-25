<template>
  <div class="product-page-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando detalles del producto...</p>
    </div>

    <div v-else class="product-details-container">
      
      <div class="product-main-content">
          
          <div class="product-gallery">
              <div class="main-image">
                  <img :src="productData.urlImagen || '/placeholder-image.jpg'" :alt="productData.nombre" />
              </div>
          </div>

          <div class="product-info">
              <h1>{{ productData.nombre }}</h1>
              
              <div class="price-section">
                  <span class="price">S/{{ productData.precioBase.toFixed(2) }}</span>
              </div>
              
              <p class="description">{{ productData.descripcionCompleta }}</p>
              
              <div class="rating">
                  <span class="stars">★★★★★</span>
                  <span class="review-count">({{ productData.resenas.length }} Comentarios)</span>
              </div>

              <div class="details-section">
                  <h3>Detalles del Producto</h3>
                  <ul>
                      <li><strong>Marca:</strong> {{ productData.marca }}</li>
                      <li><strong>Categoría:</strong> {{ productData.categoria }}</li>
                      <li><strong>Stock Actual:</strong> {{ productData.stockActual }}</li>
                      <li><strong>SKU:</strong> {{ productData.sku }}</li>
                  </ul>
              </div>
              
              <div class="quantity-selector">
                  <label>Cantidad:</label>
                  <div class="quantity-control">
                      <button @click="quantity = Math.max(1, quantity - 1)">-</button>
                      <input v-model.number="quantity" type="number" min="1" :max="productData.stockActual" />
                      <button @click="quantity = Math.min(productData.stockActual, quantity + 1)">+</button>
                  </div>
              </div>
              
              <div class="action-buttons">
                  <button class="add-to-cart-btn" @click="addToCart">
                      Agregar al carrito
                  </button>

                  <button 
                   class="wishlist-btn favorite-toggle-btn" 
                    :class="productData.isFavorite ? 'favorite-active' : 'favorite-inactive'"
                    @click="toggleFavorite" :disabled="isLoading || isToggling">
                      <i :class="productData.isFavorite ? 'fas' : 'far'" class="fa-heart" aria-hidden="true"></i>
                  </button>
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
      </div>

      <hr class="separator"/>

      <div class="reviews-section">
          <h2>Comentarios de Clientes ({{ productData.resenas.length }})</h2>
          
          <!-- FORMULARIO DE COMENTARIO -->
          <div class="review-form-container">
              <h3>Escribe tu Comentario</h3>
              <form @submit.prevent="submitReview">
                  <textarea 
                      v-model="newReviewComment" 
                      placeholder="Comparte tu opinión sobre este producto..."
                      rows="4"
                      required
                  ></textarea>
                  <button type="submit" :disabled="isSubmitting" class="submit-review-btn">
                      {{ isSubmitting ? 'Enviando...' : 'Publicar Comentario' }}
                  </button>
              </form>
              <p v-if="reviewError" class="review-error">Error: {{ reviewError }}</p>
              <p v-if="reviewSuccess" class="review-success">{{ reviewSuccess }}</p>
          </div>
          <!-- FIN FORMULARIO DE COMENTARIO -->

          <hr class="separator-reviews"/>

          <div v-if="productData.resenas.length === 0" class="no-reviews">
              <p>Sé el primero en dejar un comentario sobre este producto.</p>
          </div>

          <div v-else class="review-list">
              <div v-for="resena in productData.resenas" :key="resena.idResena" class="review-item">
                  <div class="review-header">
                      <strong>{{ resena.nombreUsuario || 'Usuario Anónimo' }}</strong>
                      <span class="review-date">{{ formatDate(resena.fecha) }}</span>
                  </div>
                  <p class="review-comment">{{ resena.comentario }}</p>
              </div>
          </div>
      </div>
    </div>

    <ToastMessage ref="favoriteToast" :message="toastMessage" :type="toastType" />

    <!-- Modal de Confirmación de Producto Añadido -->
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


<script>
import axios from 'axios';
import ToastMessage from '@/components/ToastMessage.vue';

// --- Constantes de localStorage ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';
const LOCAL_FAVORITES_KEY = 'SAGA_FAVORITES';
const API_BASE_URL = 'http://localhost:8080/api';

export default {
  name: 'DetalleProductoView',
  components: {
    ToastMessage
  },
  data() {
    return {
      isLoading: true,
      isToggling: false,
      quantity: 1,
      showSuccessMessage: false,
      newReviewComment: '',
      isSubmitting: false,
      reviewError: null,
      reviewSuccess: null,
      productData: {
        idProducto: null,
        sku: null,
        nombre: '',
        descripcionCompleta: '',
        marca: '',
        categoria: '',
        precioBase: 0,
        stockActual: 0,
        urlImagen: null,
        resenas: [],
        isFavorite: false
      },
      toastMessage: '',
      toastType: 'success',
    };
  },

  computed: {
    productId() {
      return this.$route.params.id;
    }
  },

  methods: {
    // =========================
    // TOAST
    // =========================
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.$nextTick(() => {
        this.$refs.favoriteToast.show();
      });
    },

    // =========================
    // CARRITO
    // =========================
    loadCart() {
      try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("Error al cargar el carrito de localStorage:", error);
        return [];
      }
    },

    saveCart(cart) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Error al guardar el carrito en localStorage:", error);
      }
    },

    addToCart() {
      if (this.productData.stockActual < this.quantity) {
        console.error("Error: La cantidad excede el stock disponible.");
        return; 
      }

      if (this.productData.idProducto === null) {
        console.error("Error: No se puede añadir el producto, el ID es nulo.");
        return;
      }

      const currentCart = this.loadCart();
      const uniqueId = this.productData.idProducto;
      const quantityToAdd = this.quantity;
      
      const existingItemIndex = currentCart.findIndex(item => item.id === uniqueId);

      if (existingItemIndex !== -1) {
        const newQuantity = currentCart[existingItemIndex].quantity + quantityToAdd;
        if (newQuantity <= this.productData.stockActual) {
          currentCart[existingItemIndex].quantity = newQuantity;
        } else {
          currentCart[existingItemIndex].quantity = this.productData.stockActual;
        }
      } else {
        const newItem = {
          id: uniqueId,
          name: this.productData.nombre,
          price: parseFloat(this.productData.precioBase),
          quantity: quantityToAdd,
          image: this.productData.urlImagen,
          size: 'N/A',
        };
        currentCart.push(newItem);
      }

      this.saveCart(currentCart);

      // 🔔 Avisar al Header que el carrito cambió
      window.dispatchEvent(new CustomEvent('saga:cart-updated'));
      
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 2500);
    },

    // =========================
    // FAVORITOS – helpers localStorage
    // =========================
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
        console.error('Error leyendo favoritos de localStorage:', e);
        return [];
      }
    },

    saveFavoritesToStorage(ids) {
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
    },

    // =========================
    // FAVORITOS – estado inicial
    // =========================
    async checkFavoriteStatus() {
      const pid = parseInt(this.productId, 10);
      if (!pid) return;

      // 1️⃣ Baseline: localStorage
      const storedIds = this.loadFavoritesFromStorage();
      this.productData.isFavorite = storedIds.includes(pid);

      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/favoritos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const raw = response.data;
        if (!Array.isArray(raw)) {
          console.warn('Respuesta de /favoritos no es un array:', raw);
          return;
        }

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

        this.productData.isFavorite = favoriteIds.includes(pid);
        this.saveFavoritesToStorage(favoriteIds);

      } catch (error) {
        console.warn(
          "No se pudo obtener el estado de favoritos.",
          error?.response?.status
        );
      }
    },

    // =========================
    // FAVORITOS – toggle
    // =========================
    async toggleFavorite() {
      const pid = parseInt(this.productId, 10);
      if (this.isToggling || !pid) return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        this.showToast('Debes iniciar sesión para marcar productos como favoritos.', 'error');
        this.$router.push('/login');
        return;
      }
      
      const previousStatus = this.productData.isFavorite;
      const nextStatus = !previousStatus;

      // Optimistic UI
      this.productData.isFavorite = nextStatus;
      this.isToggling = true;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        await axios.post(
          `${API_BASE_URL}/favoritos`, 
          { idProducto: pid }, 
          { headers }
        );

        // Actualizar localStorage en función del estado final
        const stored = this.loadFavoritesFromStorage();
        let updatedIds;
        if (nextStatus) {
          updatedIds = [...stored, pid];
        } else {
          updatedIds = stored.filter(id => id !== pid);
        }
        this.saveFavoritesToStorage(updatedIds);

        // 🔔 Avisar al Header que cambió la cantidad de favoritos
        window.dispatchEvent(new CustomEvent('saga:favorites-updated'));

        if (nextStatus) {
          this.showToast("El producto ha sido añadido con éxito a tu lista de deseos.", 'success');
        } else {
          this.showToast("El producto ha sido removido con éxito de tu lista de deseos.", 'remove');
        }

        // También para vistas que miran favoritesChanged
        localStorage.setItem('favoritesChanged', Date.now().toString());

      } catch (error) {
        console.error("Error al gestionar favorito:", error);
        this.productData.isFavorite = previousStatus; // revertir
        this.showToast('Hubo un error al actualizar tus favoritos.', 'error');
      } finally {
        this.isToggling = false;
      }
    },

    // =========================
    // DETALLE DE PRODUCTO
    // =========================
    async fetchProductDetails() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/productos/${this.productId}`);
        this.productData = response.data;

        this.quantity = Math.min(1, this.productData.stockActual);

        const pid = parseInt(this.productId, 10);
        const storedFavs = this.loadFavoritesFromStorage();
        this.productData.isFavorite = storedFavs.includes(pid);

      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        const errorMessage = error.response 
          ? error.response.data 
          : error.message;
        alert(`No se pudo cargar el producto. Error: ${errorMessage}`);
      } finally {
        this.isLoading = false;
      }
    },

    // =========================
    // RESEÑAS
    // =========================
    async submitReview() {
      if (!this.newReviewComment.trim()) return;

      const productoId = this.productId;
      if (!productoId || isNaN(parseInt(productoId, 10))) {
        this.reviewError = 'Error interno: ID de producto inválido en la URL.';
        return;
      }
      
      this.isSubmitting = true;
      this.reviewError = null;
      this.reviewSuccess = null;

      const reviewPayload = {
        comentario: this.newReviewComment.trim()
      };

      try { 
        const response = await axios.post(
          `${API_BASE_URL}/productos/${productoId}/resena`,
          reviewPayload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        if (response.status === 201) {
          this.reviewSuccess = 'Comentario publicado con éxito.';
          this.newReviewComment = '';
          
          const newReview = response.data;
          this.productData.resenas.push(newReview);
        }

      } catch (error) {
        console.error('Error al enviar la reseña:', error.response || error);
        if (error.response && error.response.status === 401) {
          this.reviewError = 'Debes iniciar sesión para publicar un comentario.';
        } else if (error.response && error.response.data) {
          this.reviewError = error.response.data; 
        } else {
          this.reviewError = 'Error de conexión o servidor. Intenta de nuevo.';
        }
      } finally {
        this.isSubmitting = false;
        setTimeout(() => {
          this.reviewSuccess = null;
          this.reviewError = null;
        }, 5000);
      }
    },

    formatDate(isoDate) {
      if (!isoDate) return 'Fecha desconocida';
      const date = new Date(isoDate);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
  },

  created() {
    (async () => {
      await this.fetchProductDetails();
      await this.checkFavoriteStatus();
    })();
  }
};
</script>

<style scoped>
/* Tu CSS tal cual lo tenías */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.product-details-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
  background-color: #f9f9f9;
}

.product-main-content {
  display: flex;
  gap: 40px;
}

/* Product Gallery */
.product-gallery {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  height: 400px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

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

.description {
  color: #666;
  line-height: 1.6;
  font-size: 15px;
  text-align: left;
}

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

.quantity-control button:hover {
  background-color: #f0f0f0;
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

.add-to-cart-btn:hover {
  background-color: #b3d00f;
}

/* Wishlist */
.wishlist-btn {
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  opacity: 0.85; 
}

.favorite-active {
  background-color: rgb(161, 120, 120);
  border-color: rgb(161, 120, 120);
}

.favorite-inactive {
  background-color: #d0d0d0;
  border-color: #d0d0d0; 
}

.favorite-toggle-btn .fa-heart {
  font-size: 20px; 
  color: white;
  transition: color 0.2s, transform 0.2s;
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

/* Sección de Comentarios */
.separator {
  border: none;
  border-top: 1px solid #ddd;
  margin: 40px 0;
}

.reviews-section {
  padding-top: 20px;
  text-align: left;
}

.reviews-section h2 {
  font-size: 24px;
  margin-bottom: 25px;
  color: #1a1a1a;
  font-weight: 600;
}

.review-form-container {
  margin-bottom: 25px;
}

.review-form-container h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #1a1a1a;
}

.review-form-container form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-form-container textarea {
  width: 100%; 
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 15px;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
}

.review-form-container textarea:focus {
  outline: none;
  border-color: #C5E01B;
}

.submit-review-btn {
  padding: 12px 20px;
  background-color: #C5E01B;
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-start;
}

.submit-review-btn:hover {
  background-color: #b3d00f;
}

.review-error, .review-success {
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 10px;
  font-weight: 500;
}

.review-error {
  color: #b91c1c;
  background-color: #fee2e2;
  border: 1px solid #f87171;
}

.review-success {
  color: #047857;
  background-color: #d1fae5;
  border: 1px solid #34d399;
}

.separator-reviews {
  border: none;
  border-top: 1px solid #ddd;
  margin: 25px 0;
}

.no-reviews {
  padding: 20px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  color: #666;
  text-align: center;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-item {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.review-header strong {
  font-size: 16px;
  color: #1a1a1a;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-comment {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
}

/* Modal helpers (sin Tailwind real) */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bg-gray-600 { background-color: #4b5563; }
.bg-opacity-50 { background-color: rgba(75, 85, 99, 0.5); }
.flex, .items-center, .justify-center { display: flex; align-items: center; justify-content: center; }
.z-50 { z-index: 50; }

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

/* Responsive */
@media (max-width: 900px) {
  .product-main-content {
    flex-direction: column;
  }
}
</style>
