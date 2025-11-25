<template>
  <div class="shopping-cart-container">
    <div class="cart-content">
      <!-- Cart Items Section -->
      <div class="cart-items-section">
        <h1 class="section-title">Carrito de compras ({{ totalItems }} artículos)</h1>

        <!-- Mensaje de Carrito Vacío -->
        <div v-if="cartItems.length === 0" class="empty-cart-message">
          <div class="empty-cart-inner">
            <div class="empty-cart-icon-wrapper">
              <svg class="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                </path>
              </svg>
            </div>
            <h2 class="empty-cart-title">Tu carrito está vacío</h2>
            <p class="empty-cart-subtitle">
              Aún no has agregado productos. Explora el catálogo y encuentra lo que necesitas.
            </p>
            <router-link to="/catalogo" class="empty-cart-cta">
              Ver catálogo
            </router-link>
          </div>
        </div>
        
        <div class="cart-items" v-else>
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="item-image">
              <img :src="item.image" :alt="item.name"
                   onerror="this.onerror=null; this.src='https://placehold.co/100x100/eeeeee/333333?text=Product';" />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              
              <p class="item-price">S/.{{ item.price.toFixed(2) }}</p>
            </div>
            
            <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQty(item.id)" :disabled="item.quantity <= 1">-</button>
              <span class="qty-display">{{ item.quantity }}</span> 
              <button class="qty-btn" @click="increaseQty(item.id)">+</button>
            </div>

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
        
        <button class="checkout-btn"
                :disabled="cartItems.length === 0"
                @click="proceedToCheckout">
          Proceder a Pagar
        </button>
        <button class="clear-cart-btn"
                v-if="cartItems.length > 0"
                @click="openClearCartModal">
          Vaciar Carrito
        </button>
      </div>
      
    </div>

    <!-- 🔹 Modal de confirmación para "Vaciar Carrito" -->
    <div v-if="showClearModal" class="modal-overlay">
      <div class="modal-dialog">
        <h3 class="modal-title">Vaciar carrito</h3>
        <p class="modal-text">
          ¿Estás seguro de que quieres vaciar tu carrito? Esta acción no se puede deshacer.
        </p>
        <div class="modal-actions">
          <button class="modal-btn modal-btn-danger" @click="confirmClearCart">
            Sí, vaciar
          </button>
          <button class="modal-btn modal-btn-secondary" @click="cancelClearCart">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Modal: carrito vacío al intentar pagar -->
    <div v-if="showEmptyCheckoutModal" class="modal-overlay">
      <div class="modal-dialog">
        <h3 class="modal-title">No tienes productos en el carrito</h3>
        <p class="modal-text">
          Para continuar con el pago, primero agrega uno o más productos a tu carrito.
        </p>
        <div class="modal-actions">
          <router-link to="/catalogo" class="modal-btn modal-btn-secondary modal-link-btn">
            Ir al catálogo
          </router-link>
          <button class="modal-btn modal-btn-primary" @click="closeEmptyCheckoutModal">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Modal: Confirmación de pedido -->
    <div v-if="showOrderModal" class="modal-overlay">
      <div class="modal-dialog modal-dialog-lg">
        <h3 class="modal-title">Confirmar pedido</h3>
        <p class="modal-text">
          Revisa los detalles de tu pedido y completa la información para procesar el pago.
        </p>

        <div class="order-modal-layout">
          <!-- Columna izquierda: resumen del carrito -->
          <div class="order-modal-left">
            <h4 class="order-modal-subtitle">Productos</h4>
            <div class="order-items-list">
              <div v-for="item in cartItems" :key="item.id" class="order-item-row">
                <div class="order-item-info">
                  <span class="order-item-name">{{ item.name }}</span>
                  <span class="order-item-qty">x{{ item.quantity }}</span>
                </div>
                <div class="order-item-total">
                  S/.{{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <div class="order-modal-total-row">
              <span>Total a pagar</span>
              <span class="order-modal-total-amount">S/.{{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Columna derecha: datos del cliente y pago -->
          <div class="order-modal-right">
            <h4 class="order-modal-subtitle">Datos del cliente</h4>

            <div class="form-group-inline">
              <div class="form-group">
                <label for="dni">DNI</label>
                <input id="dni"
                       v-model="dni"
                       type="text"
                       maxlength="8"
                       placeholder="Ingresa tu DNI" />
              </div>
              <button class="dni-lookup-btn" @click="buscarDniReniec" type="button">
                Consultar RENIEC (simulado)
              </button>
            </div>

            <div class="form-group">
              <label for="direccion">Dirección de envío</label>
              <input id="direccion"
                     v-model="direccionEnvio"
                     type="text"
                     placeholder="Ej. Av. Primavera 123, Dep. 502" />
              <small class="input-help">
                Usaremos esta dirección para el envío. Más adelante puedes conectarlo con tu dirección de cuenta.
              </small>
            </div>

            <h4 class="order-modal-subtitle">Pago con tarjeta</h4>

            <div class="form-group">
              <label for="cardName">Nombre del titular</label>
              <input id="cardName"
                     v-model="cardName"
                     type="text"
                     placeholder="Como aparece en la tarjeta" />
            </div>
            
            <div class="form-group">
              <label>Datos de la tarjeta</label>
              <!-- Aquí Stripe montará el formulario de tarjeta -->
              <div ref="cardElement" class="card-element"></div>
            </div>

            <p v-if="orderError" class="order-error">{{ orderError }}</p>
          </div> 
        </div> 


        <div class="modal-actions modal-actions-right">
          <button class="modal-btn modal-btn-secondary" @click="cancelOrder" :disabled="isSubmittingOrder">
            Cancelar
          </button>
          <button class="modal-btn modal-btn-primary"
                  @click="confirmOrder"
                  :disabled="isSubmittingOrder">
            {{ isSubmittingOrder ? 'Procesando...' : 'Confirmar pedido' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Modal pequeño: Pago completado -->
    <div v-if="showPaymentSuccessModal" class="modal-overlay">
      <div class="modal-dialog">
      <h3 class="modal-title">¡Pago exitoso!</h3>
      <p class="modal-text">
         Tu pago fue procesado correctamente.
         <br>
         <span v-if="lastPedidoNumeroCliente !== null">
           Tu pedido #{{ formatPedidoNumber(lastPedidoNumeroCliente) }} ha sido creado.
         </span>
         <br>
         <span v-if="trackingCode">
            Código de seguimiento: <strong>{{ trackingCode }}</strong>
         </span>
      </p>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-primary" @click="closePaymentSuccessModal">
          Aceptar
        </button>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useRoute } from 'vue-router';

// --- Constante ---
const LOCAL_STORAGE_KEY = 'SAGA_SHOPPING_CART';
const TRACKING_STORAGE_KEY = 'SAGA_TRACKING_HISTORY';

// ⭐ helper para notificar al header
const emitCartUpdated = () => {
  window.dispatchEvent(new CustomEvent('saga:cart-updated'));
};

// 🔹 Estados para modales
const showClearModal = ref(false);
const showEmptyCheckoutModal = ref(false);
const showOrderModal = ref(false);

// Para el segundo modal de éxito de pago
const showPaymentSuccessModal = ref(false);
const lastPedidoId = ref(null);
const lastPedidoNumeroCliente = ref(null);
const trackingCode = ref(null);

// redireccion a otra vista
const router = useRouter();
const route = useRoute();

// 🔹 Estados del formulario de pedido
const dni = ref('');
const direccionEnvio = ref('');
const cardName = ref('');
const isSubmittingOrder = ref(false);
const orderError = ref('');
const orderSuccess = ref('');

// 🔹 Stripe
const stripe = ref(null);
const elements = ref(null);
const card = ref(null);
const cardElement = ref(null);
const clientSecret = ref(null);

// --- Estado reactivo del carrito ---
const cartItems = ref([]);
const shippingCost = ref('Free'); // Costo de envío

// --- Funciones de Utilidad de LocalStorage ---
const loadCart = () => {
  try {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error al cargar el carrito de localStorage:', error);
    return [];
  }
};

const saveCart = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems.value));
    // ⭐ Notificar SIEMPRE que el carrito cambie
    emitCartUpdated();
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error);
  }
};

// 🔹 Pequeña función para intentar precargar datos del usuario
const fetchUserData = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    const user = JSON.parse(rawUser);

    if (user.dni) {
      dni.value = String(user.dni);
    }
    if (user.direccionCalle) {
      direccionEnvio.value = String(user.direccionCalle);
    }
  } catch (e) {
    console.error('Error leyendo datos de usuario:', e);
  }
};

// --- Lifecycle Hook para carga inicial ---
onMounted(() => {
  cartItems.value = loadCart();
  console.log('Carrito cargado desde localStorage:', cartItems.value);

  fetchUserData();

  const checkout = route.query.checkout;
  const dniQuery = route.query.dni;
  const dirQuery = route.query.direccion;

  if (checkout === 'true' && cartItems.value.length > 0) {
    if (dniQuery) dni.value = String(dniQuery);
    if (dirQuery) direccionEnvio.value = String(dirQuery);
    proceedToCheckout();
  }
});

// --- Watcher para persistencia automática ---
watch(
  cartItems,
  () => {
    saveCart(); // ⭐ aquí también dispara el evento
  },
  { deep: true }
);

// --- Lógica y Computadas ---
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

const total = computed(() => subtotal.value);

const increaseQty = (id) => {
  const item = cartItems.value.find((i) => i.id === id);
  if (item) {
    item.quantity++;
    // (no hace falta llamar saveCart aquí porque el watcher ya lo hace)
  }
};

const decreaseQty = (id) => {
  const itemIndex = cartItems.value.findIndex((i) => i.id === id);
  if (itemIndex !== -1) {
    const item = cartItems.value[itemIndex];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      deleteItem(id);
    }
  }
};

const deleteItem = (id) => {
  cartItems.value = cartItems.value.filter((i) => i.id !== id);
  // watcher + saveCart -> emitCartUpdated
};

// 🔹 Modal "Vaciar carrito"
const openClearCartModal = () => {
  showClearModal.value = true;
};

const confirmClearCart = () => {
  cartItems.value = [];
  showClearModal.value = false;
  // watcher + saveCart -> emitCartUpdated
};

const cancelClearCart = () => {
  showClearModal.value = false;
};

// 🔹 Modal "checkout con carrito vacío"
const closeEmptyCheckoutModal = () => {
  showEmptyCheckoutModal.value = false;
};

const formatPedidoNumber = (n) => {
  if (n == null) return '';
  return n.toString().padStart(2, '0');
};

// 🔹 Flujo al presionar "Proceder a pagar"
const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    showEmptyCheckoutModal.value = true;
    return;
  }
  orderError.value = '';
  orderSuccess.value = '';
  showOrderModal.value = true;
};

watch(showOrderModal, async (visible) => {
  if (visible) {
    orderError.value = '';
    orderSuccess.value = '';
    await nextTick();
    await initStripeAndPaymentIntent();
  } else {
    if (card.value) {
      card.value.unmount();
      card.value = null;
    }
    elements.value = null;
    clientSecret.value = null;
  }
});

// 🔹 Botón RENIEC (simulado)
const buscarDniReniec = () => {
  if (!dni.value) {
    orderError.value = 'Ingresa un DNI antes de consultar.';
    return;
  }
  console.log('Consulta RENIEC simulada para DNI:', dni.value);
  orderError.value = '';
};

const initStripeAndPaymentIntent = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      orderError.value = 'Debes iniciar sesión para iniciar el pago.';
      return;
    }

    isSubmittingOrder.value = true;

    if (!stripe.value) {
      const publishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || '';
      stripe.value = await loadStripe(publishableKey);
      if (!stripe.value) {
        throw new Error(
          'No se pudo inicializar Stripe. Revisa tu publishable key.'
        );
      }
    }

    const detalles = cartItems.value.map((item) => ({
      idProducto: item.id,
      cantidad: item.quantity,
    }));

    const { data } = await axios.post(
      'http://localhost:8080/api/payments/create-intent',
      { detalles },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    clientSecret.value = data.clientSecret;

    if (!elements.value) {
      elements.value = stripe.value.elements();
    }

    if (!card.value && cardElement.value) {
      card.value = elements.value.create('card');
      card.value.mount(cardElement.value);
    }
  } catch (error) {
    console.error('Error Stripe:', error);
    orderError.value =
      error.response?.data ||
      error.message ||
      'Error al inicializar el pago con tarjeta.';
  } finally {
    isSubmittingOrder.value = false;
  }
};

// 🔹 Cancelar pedido
const cancelOrder = () => {
  if (isSubmittingOrder.value) return;
  showOrderModal.value = false;
};

const closePaymentSuccessModal = () => {
  showPaymentSuccessModal.value = false;
  showOrderModal.value = false;

  dni.value = '';
  direccionEnvio.value = '';
  cardName.value = '';
  orderError.value = '';
  orderSuccess.value = '';

  router.push({
    path: '/perfil',
    query: { section: 'Historial y Pedidos' },
  });
};

// 🔹 Confirmar pedido
const confirmOrder = async () => {
  orderError.value = '';
  orderSuccess.value = '';

  const token = localStorage.getItem('accessToken');
  if (!token) {
    orderError.value = 'Debes iniciar sesión para completar el pedido.';
    return;
  }

  if (!dni.value || !direccionEnvio.value || !cardName.value) {
    orderError.value =
      'Por favor, completa DNI, dirección y nombre del titular.';
    return;
  }

  if (!stripe.value || !clientSecret.value || !card.value) {
    orderError.value =
      'El formulario de pago aún no está listo. Cierra y vuelve a abrir el modal.';
    return;
  }

  isSubmittingOrder.value = true;

  try {
    const { paymentIntent, error } = await stripe.value.confirmCardPayment(
      clientSecret.value,
      {
        payment_method: {
          card: card.value,
          billing_details: {
            name: cardName.value,
          },
        },
      }
    );

    if (error) {
      console.error('Error al procesar pago:', error);
      orderError.value =
        error.message || 'Error al procesar el pago con tarjeta.';
      isSubmittingOrder.value = false;
      return;
    }

    if (paymentIntent.status !== 'succeeded') {
      orderError.value = `El pago no se completó. Estado: ${paymentIntent.status}`;
      isSubmittingOrder.value = false;
      return;
    }

    const detalles = cartItems.value.map((item) => ({
      idProducto: item.id,
      cantidad: item.quantity,
    }));

    const payload = {
      direccionEnvio: direccionEnvio.value,
      dni: dni.value,
      metodoPago: 'TARJETA_STRIPE',
      paymentIntentId: paymentIntent.id,
      detalles,
    };

    const response = await axios.post(
      'http://localhost:8080/api/checkout/stripe/confirm',
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const pedidoCreado = response.data;

    lastPedidoId.value = pedidoCreado.idPedido;
    lastPedidoNumeroCliente.value = pedidoCreado.numeroPedidoCliente;

    const trackingCodeStr = `SAGA-${String(
      pedidoCreado.numeroPedidoCliente
    ).padStart(4, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    trackingCode.value = trackingCodeStr;

    const newTrackingEntry = {
      numeroPedidoCliente: pedidoCreado.numeroPedidoCliente,
      trackingCode: trackingCodeStr,
      createdAt: Date.now(),
    };

    try {
      const historyRaw = localStorage.getItem(TRACKING_STORAGE_KEY);
      let history = [];

      if (historyRaw) {
        const parsed = JSON.parse(historyRaw);
        history = Array.isArray(parsed) ? parsed : [parsed];
      }

      history.push(newTrackingEntry);
      localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error guardando historial de tracking:', e);
    }

    // 🔹 Limpiar carrito y notificar
    cartItems.value = [];
    saveCart(); // ⭐ esto emite saga:cart-updated también

    orderError.value = '';
    orderSuccess.value = '';
    showPaymentSuccessModal.value = true;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    orderError.value =
      error.response?.data ||
      error.message ||
      'No se pudo completar el pedido. Inténtalo de nuevo.';
  } finally {
    isSubmittingOrder.value = false;
  }
};
</script>


<style scoped>
/* --- Igual que antes + estilos de modales y estado vacío --- */
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

/* 🔹 Estado "Carrito vacío" */
.empty-cart-message {
  text-align: center;
  padding: 40px 20px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  border: 1px dashed #d1d5db;
  max-width: 480px;
  margin: 40px auto 0 auto;
}

.empty-cart-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-cart-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: #f3f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.empty-cart-icon {
  width: 32px;
  height: 32px;
  color: #6366f1;
}

.empty-cart-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.empty-cart-subtitle {
  font-size: 14px;
  color: #6b7280;
  max-width: 360px;
}

.empty-cart-cta {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  background-color: #aad500;
  color: #ffffff;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(170, 213, 0, 0.45);
  transition: background-color 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease;
}

.empty-cart-cta:hover {
  background-color: #94bf00;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(170, 213, 0, 0.55);
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
  border-radius: 12px;
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
  border-radius: 8px;
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
  color: #28a745;
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
  background-color: #b3d900;
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

/* 🔹 Modales */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-dialog {
  background: #ffffff;
  max-width: 420px;
  width: 90%;
  border-radius: 12px;
  padding: 24px 20px 20px;
  box-shadow: 0 20px 30px rgba(15, 23, 42, 0.25);
  text-align: center;
}

.modal-dialog-lg {
  max-width: 900px;
  text-align: left;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2933;
}

.modal-text {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-actions-right {
  justify-content: flex-end;
}

.modal-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.15s ease, transform 0.05s ease;
}

.modal-btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}

.modal-btn-danger:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.modal-btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.modal-btn-secondary:hover {
  background-color: #d1d5db;
  transform: translateY(-1px);
}

.modal-btn-primary {
  background-color: #aad500;
  color: #ffffff;
}

.modal-btn-primary:hover {
  background-color: #94bf00;
  transform: translateY(-1px);
}

/* Router-link con estilo botón */
.modal-link-btn {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 🔹 Layout del modal de pedido */
.order-modal-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.2fr);
  gap: 24px;
  margin-bottom: 16px;
}

.order-modal-subtitle {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.order-items-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  max-height: 220px;
  overflow-y: auto;
  background-color: #f9fafb;
}

.order-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
  border-bottom: 1px dashed #e5e7eb;
}

.order-item-row:last-child {
  border-bottom: none;
}

.order-item-info {
  display: flex;
  flex-direction: column;
}

.order-item-name {
  font-weight: 600;
  color: #111827;
}

.order-item-qty {
  font-size: 12px;
  color: #6b7280;
}

.order-item-total {
  font-weight: 600;
  color: #111827;
}

.order-modal-total-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 700;
}

.order-modal-total-amount {
  color: #16a34a;
}

/* Columna derecha: formulario */
.order-modal-right {
  font-size: 14px;
}

.form-group {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

.form-group input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #aad500;
  box-shadow: 0 0 0 1px rgba(170, 213, 0, 0.5);
}

.input-help {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.form-group-row {
  display: flex;
  gap: 10px;
}

.form-group-inline {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 10px;
}

.dni-lookup-btn {
  padding: 8px 10px;
  white-space: nowrap;
  border-radius: 8px;
  border: none;
  background-color: #e5e7eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.dni-lookup-btn:hover {
  background-color: #d1d5db;
}

.order-error {
  margin-top: 6px;
  font-size: 13px;
  color: #dc2626;
}

.order-success {
  margin-top: 6px;
  font-size: 13px;
  color: #16a34a;
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

@media (max-width: 900px) {
  .order-modal-layout {
    grid-template-columns: 1fr;
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
    margin-left: auto;
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

.card-element {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 10px;
  background-color: #f9fafb;
}

.card-element.StripeElement--invalid {
  border-color: #dc2626;
}

</style>
