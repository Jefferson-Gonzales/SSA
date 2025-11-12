<template>
  <div class="shopping-cart-container">
    <div class="cart-content">
      <!-- Cart Items Section -->
      <div class="cart-items-section">
        <h1 class="section-title">Carrito de compras ({{ totalItems }} artículos)</h1>

        <!-- Mensaje de Carrito Vacío -->
        <div v-if="cartItems.length === 0" class="empty-cart-message">
          <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <p class="text-xl text-gray-600 font-medium">Tu carrito está vacío.</p>
          <p class="text-sm text-gray-500 mt-2">Agrega productos para continuar la compra.</p>
        </div>
        
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" onerror="this.onerror=null; this.src='https://placehold.co/100x100/eeeeee/333333?text=Product';"  />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-size">{{ item.size }}</p>
              <p class="item-price">S/.{{ item.price.toFixed(2) }}</p>
            </div>
            
            <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQty(item.id)" :disabled="item.quantity <= 1">-</button>
              <!-- Usamos la cantidad del item directamente -->
              <span class="qty-display">{{ item.quantity }}</span> 
              <button class="qty-btn" @click="increaseQty(item.id)">+</button>
            </div>

             <!-- Subtotal por item -->
            <p class="item-subtotal">S/.{{ (item.price * item.quantity).toFixed(2) }}</p>
            
            <button class="delete-btn" @click="deleteItem(item.id)">
              <img src="https://img.icons8.com/ios/50/delete--v1.png" width="25" alt="delete">
            </button>
          </div>
        </div>
      </div>
      
      <!-- Order Summary Section -->
      <div class="order-summary">
        <h2 class="summary-title">Resumen del pedido</h2>
        
        <div class="summary-row">
          <span class="summary-label">Subtotal ({{ totalItems }} artículos)</span>
          <span class="summary-value">S/.{{ subtotal.toFixed(2) }}</span>
        </div>
        
        <div class="summary-row">
          <span class="summary-label">Envío</span>
          <span class="summary-value shipping">{{ shippingCost }}</span>
        </div>

        <div class="summary-divider"></div>
        
        <div class="summary-row total">
          <span class="summary-label">Total</span>
          <span class="summary-value">S/.{{ total.toFixed(2) }}</span>
        </div>
        
        <button class="checkout-btn" :disabled="cartItems.length === 0" @click="proceedToCheckout">Proceder a Pagar</button>
        <button class="clear-cart-btn" v-if="cartItems.length > 0" @click="clearCart">Vaciar Carrito</button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// --- Constante ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';

// --- Estado reactivo del carrito ---
// Inicialmente, será un array vacío. Los datos se cargarán en onMounted.
const cartItems = ref([]);
const shippingCost = ref('Free'); // Costo de envío

// --- Funciones de Utilidad de LocalStorage ---

/** Carga el carrito desde localStorage. Devuelve un array vacío si falla o no existe. */
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
const saveCart = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems.value));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
};

// --- Lifecycle Hook para carga inicial ---
onMounted(() => {
  cartItems.value = loadCart();
  console.log('Carrito cargado desde localStorage:', cartItems.value);
});

// --- Watcher para persistencia automática ---
// Observa cambios profundos en el array cartItems (añadir, eliminar, cambiar cantidad)
watch(cartItems, () => {
  saveCart();
}, { deep: true });


// --- Lógica y Computadas ---

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
  // Aquí se podría sumar el costo de envío si no fuera "Free"
  // let finalTotal = subtotal.value;
  // if (shippingCost.value !== 'Free') { finalTotal += parseFloat(shippingCost.value); }
  return subtotal.value;
});

const increaseQty = (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    item.quantity++;
    // El watcher guardará automáticamente
  }
};

const decreaseQty = (id) => {
  const itemIndex = cartItems.value.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    const item = cartItems.value[itemIndex];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      // Si la cantidad es 1 y se intenta decrementar, se elimina el item
      deleteItem(id);
    }
    // El watcher guardará automáticamente
  }
};

const deleteItem = (id) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id);
  // El watcher guardará automáticamente
};

const clearCart = () => {
    // Implementar modal de confirmación en un entorno real
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        cartItems.value = [];
        // El watcher guardará automáticamente (vacío)
    }
};

const proceedToCheckout = () => {
    if (cartItems.value.length === 0) {
        // En un entorno real, usar un modal de error, no alert
        alert("El carrito está vacío. Por favor, añada productos antes de pagar.");
        return;
    }
    // Lógica para enviar el carrito (cartItems.value) al backend para el proceso de pago
    console.log("Iniciando checkout con el carrito:", cartItems.value);
    alert(`Checkout iniciado. Total a pagar: S/.${total.value.toFixed(2)}`);
};

// Exportar las funciones para que puedan ser usadas por otros componentes si se integrara
/*defineExpose({
    cartItems,
    loadCart,
    saveCart
});
*/
</script>

<style scoped>
/* ----------------------------------- */
/* ESTILOS (Ajustados ligeramente)    */
/* ----------------------------------- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.shopping-cart-container {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.cart-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

/* Cart Items Section */
.cart-items-section {
  flex: 1;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #1a1a1a;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.empty-cart-message {
  text-align: center;
  padding: 50px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px dashed #ccc;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 12px; /* Más redondeado */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.item-image {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid #eee;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-details {
  flex: 1;
  text-align: left;
}

.item-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 3px;
}

.item-size {
  font-size: 14px;
  color: #777;
  margin-bottom: 6px;
}

.item-price {
  font-size: 16px;
  font-weight: 500;
  color: #555;
}

.item-subtotal {
    width: 100px;
    font-size: 18px;
    font-weight: 700;
    color: #000;
    text-align: right;
    flex-shrink: 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #ddd;
  border-radius: 8px; /* Más redondeado */
  background-color: #f5f5f5;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #444;
  transition: background-color 0.2s;
  font-weight: 700;
}

.qty-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.qty-btn:disabled {
    color: #ccc;
    cursor: not-allowed;
}

.qty-display {
  width: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  height: 36px;
  line-height: 36px;
}

.delete-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-left: 15px;
  transition: transform 0.2s;
}

.delete-btn img {
    filter: invert(45%) sepia(35%) saturate(2326%) hue-rotate(320deg) brightness(97%) contrast(97%);
}

.delete-btn:hover {
  transform: scale(1.1);
}

/* Order Summary Section */
.order-summary {
  width: 350px;
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-size: 16px;
}

.summary-label {
  color: #666;
  font-weight: 500;
}

.summary-value {
  color: #1a1a1a;
  font-weight: 600;
}

.summary-value.shipping {
  color: #28a745; /* Verde */
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

.summary-row.total {
  margin-bottom: 30px;
  padding-top: 10px;
  border-top: 1px dashed #e0e0e0;
}

.summary-row.total .summary-label,
.summary-row.total .summary-value {
  font-size: 20px;
  font-weight: 800;
  color: #000;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #b3d900; /* Azul vibrante */
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 2px 4px #b3d900;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #a5c80a;
  transform: translateY(-1px);
}

.checkout-btn:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    box-shadow: none;
}

.clear-cart-btn {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.clear-cart-btn:hover {
    background-color: #dc3545;
    color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    flex-direction: column;
  }

  .order-summary {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
    .cart-item {
        flex-wrap: wrap;
        gap: 15px;
        justify-content: space-between;
    }
    
    .item-image {
        order: 1;
        width: 80px;
        height: 80px;
    }

    .item-details {
        order: 2;
        min-width: 150px;
        text-align: left;
    }

    .quantity-control {
        order: 3;
        margin-left: auto; /* Mueve el control a la derecha */
    }
    
    .item-subtotal {
        order: 4;
        width: 100%;
        text-align: right;
        font-size: 16px;
        border-top: 1px dashed #eee;
        padding-top: 10px;
    }

    .delete-btn {
        order: 5;
        margin-left: 0;
    }
}
</style>