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
                  <button class="wishlist-btn" @click="toggleWishlist">
                      ♡
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
    <!-- Modal de Confirmación de Producto Añadido (Usando clases Tailwind) -->
    <div v-if="showSuccessMessage" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <svg class="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-lg font-bold mb-2 text-gray-800">¡Producto Añadido!</h3>
            <p class="text-sm text-gray-600">El artículo ha sido agregado a tu carrito.</p>
            <button @click="showSuccessMessage = false" class="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-150">
                Cerrar
            </button>
        </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios

// --- Constante de localStorage ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';

export default {
    name: 'DetalleProductoView',
    data() {
        return {
            isLoading: true,
            quantity: 1,
            // 1. NUEVO ESTADO para el modal de éxito
            showSuccessMessage: false, 
            // Nuevo estado para el formulario
            newReviewComment: '',
            isSubmitting: false,
            reviewError: null,
            reviewSuccess: null,
            // Inicializar con la estructura esperada del DTO
            productData: {
                idProducto: null,
                sku: null,
                nombre: '',
                descripcionCompleta: '',
                marca: '',
                categoria: '',
                precioBase: 0,
                stockActual: 0,
                urlImagen: null, // Campo que debe venir del backend
                resenas: [], // Listo para recibir la lista de reseñas
            },
        };
    },
    computed: {
        productId() {
            // Obtenemos el ID del producto desde la ruta (ej: /productos/13)
            return this.$route.params.id;
        }
    },


    methods: {

      // --- FUNCIONES DE CARRITO ---
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
        
        // 2. LÓGICA DE AÑADIR AL CARRITO
        addToCart() {
            if (this.productData.stockActual < this.quantity) {
                // Usamos un modal o mensaje de error en lugar de alert()
                console.error("Error: La cantidad excede el stock disponible.");
                // Aquí podrías implementar un mensaje de error en el template si lo necesitas.
                return; 
            }

            if (this.productData.idProducto === null) {
                console.error("Error: No se puede añadir el producto, el ID es nulo.");
                return;
            }

            // 1. Cargar el carrito actual
            const currentCart = this.loadCart();

            // 2. Definir un ID único para el producto en el carrito
            const uniqueId = this.productData.idProducto;
            const quantityToAdd = this.quantity;
            
            // 3. Buscar si el producto ya existe en el carrito
            const existingItemIndex = currentCart.findIndex(item => item.id === uniqueId);

            if (existingItemIndex !== -1) {
                // A. Si existe, incrementa la cantidad (sin exceder el stock)
                const newQuantity = currentCart[existingItemIndex].quantity + quantityToAdd;
                
                // Opción: Evitar añadir si la nueva cantidad supera el stock
                if (newQuantity <= this.productData.stockActual) {
                    currentCart[existingItemIndex].quantity = newQuantity;
                } else {
                    currentCart[existingItemIndex].quantity = this.productData.stockActual;
                }
                
                console.log(`Producto ${this.productData.nombre} encontrado. Cantidad incrementada a ${currentCart[existingItemIndex].quantity}.`);

            } else {
                // B. Si no existe, crea el nuevo objeto de item del carrito
                const newItem = {
                    id: uniqueId,                       // CLAVE CRUCIAL: 'id'
                    name: this.productData.nombre,      // CLAVE CRUCIAL: 'name'
                    price: parseFloat(this.productData.precioBase), // CLAVE CRUCIAL: 'price'
                    quantity: quantityToAdd,           // CLAVE CRUCIAL: 'quantity'
                    image: this.productData.urlImagen,  // CLAVE CRUCIAL: 'image'
                    size: 'N/A',                       // CLAVE CRUCIAL: 'size' (o usa un valor real si aplica)
                };
                currentCart.push(newItem);
                console.log(`Producto ${this.productData.nombre} añadido por primera vez con cantidad ${quantityToAdd}.`);
            }

            // 4. Guardar el carrito actualizado
            this.saveCart(currentCart);
            
            // 5. Mostrar el modal de éxito
            this.showSuccessMessage = true;
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 2500); // Ocultar el mensaje después de 2.5 segundos

         // alert(`Añadido al carrito: ${this.quantity} x ${this.productData.nombre}`); // Eliminado
        },

        async fetchProductDetails() {
            this.isLoading = true;
            try {
                // Endpoint real: http://localhost:8080/api/productos/13
                const response = await axios.get(`http://localhost:8080/api/productos/${this.productId}`);
                
                // Mapear la respuesta al objeto productData
                this.productData = response.data;
                
                // Inicializar la cantidad al máximo permitido o 1
                this.quantity = Math.min(1, this.productData.stockActual); 
                
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
        async submitReview() {
          
            if (!this.newReviewComment.trim()) return; // Prevenir envío de comentarios vacíos

            // 1. **OBTENER Y VALIDAR EL ID DEL PRODUCTO**
            const productoId = this.productId; // Viene como string de la ruta

            if (!productoId || isNaN(parseInt(productoId, 10))) {
                this.reviewError = 'Error interno: ID de producto inválido en la URL.';
                return;
            }
            
            this.isSubmitting = true;
            this.reviewError = null;
            this.reviewSuccess = null;
            

            // 1. Crear el objeto DTO (solo necesitamos el 'comentario')
            const reviewPayload = {
                comentario: this.newReviewComment.trim()
            };

            try { 
                // 2. Enviar la solicitud POST
                // Endpoint: POST /api/productos/{idProducto}/resena
                //var productoId = parseInt(String, this.productId)
                const response = await axios.post(
                    `http://localhost:8080/api/productos/${productoId}/resena`,
                    reviewPayload,
                    {
                        // 3. ⚠️ IMPORTANT: Se necesita un token de autenticación (JWT) para tu backend de Spring Security.
                        // Asumiendo que usas Spring Security y que el token está guardado en localStorage o en Vuex.
                        // Ejemplo:
                         headers: {
                             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                         },
/*
                         body :{
                          'comentario': 'asd'
                         }*/
                        // Si estás en desarrollo y has deshabilitado temporalmente la seguridad para el POST: 
                        // Ignora el header por ahora, pero actívalo en producción.
                    }
                );

                // 4. Procesar la respuesta
                if (response.status === 201) {
                    this.reviewSuccess = 'Comentario publicado con éxito.';
                    this.newReviewComment = ''; // Limpiar el textarea
                    
                    // 5. Refrescar la lista de reseñas para ver el nuevo comentario
                    // Nota: Llamar a fetchProductDetails recarga TODO el producto. 
                    // Si solo quieres añadir la reseña recién creada (response.data), puedes hacerlo directamente:
                    const newReview = response.data;
                    this.productData.resenas.push(newReview);
                    
                    // Opcional: Recargar todo (más seguro, pero más lento)
                    // await this.fetchProductDetails(); 
                }

            } catch (error) {
                console.error('Error al enviar la reseña:', error.response || error);
                if (error.response && error.response.status === 401) {
                    this.reviewError = 'Debes iniciar sesión para publicar un comentario.';
                } else if (error.response && error.response.data) {
                    // Mostrar el mensaje de error que devuelve Spring
                    this.reviewError = error.response.data; 
                } else {
                    this.reviewError = 'Error de conexión o servidor. Intenta de nuevo.';
                }
            } finally {
                this.isSubmitting = false;
                // Limpiar el mensaje de éxito/error después de unos segundos
                setTimeout(() => {
                    this.reviewSuccess = null;
                    this.reviewError = null;
                }, 5000);
            }
        },
        formatDate(isoDate) {
            if (!isoDate) return 'Fecha desconocida';
            // Formato más legible (puedes usar librerías como 'moment' o 'date-fns' para algo más avanzado)
            const date = new Date(isoDate);
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        },
        /*addToCart() {
            alert(`Añadido al carrito: ${this.quantity} x ${this.productData.nombre}`);
        },*/
        toggleWishlist() {
            alert('Añadido a lista de deseos!');
        },
    },
    created() {
        // Llamar a la función de carga cuando el componente se crea
        this.fetchProductDetails();
    }
};
</script>

<style scoped>
/* A partir de aquí sigue la totalidad de tu CSS */
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
  flex-direction: column; /* Lo mantenemos para apilar main-content y reviews */
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
  height: 400px; /* Ajuste para que se vea mejor */
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

/* Sección de Comentarios/Reseñas */
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

/* --- Nuevos estilos para el Formulario de Comentario --- */
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
    /* ESTILO CLAVE: Haz que ocupe todo el ancho */
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
    border-color: #C5E01B; /* Resalta el borde al hacer foco */
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
    align-self: flex-start; /* Hace que el botón solo sea tan ancho como el texto */
}

.submit-review-btn:hover {
    background-color: #b3d00f;
}

/* Estilos para mensajes de error y éxito */
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
/* --- Fin de nuevos estilos para el Formulario de Comentario --- */
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


/* Responsive Design */
@media (max-width: 900px) {
    .product-main-content {
        flex-direction: column;
    }
}
</style>