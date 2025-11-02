<template>
  <div class="shopping-cart-container">
    <div class="cart-content">
      <!-- Cart Items Section -->
      <div class="cart-items-section">
        <h1 class="section-title">Carrito de compras</h1>
        
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-size">{{ item.size }}</p>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
            </div>
            
            <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQty(item.id)">-</button>
              <input type="number" v-model.number="item.quantity" class="qty-input" />
              <button class="qty-btn" @click="increaseQty(item.id)">+</button>
            </div>
            
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
          <span class="summary-label">Subtotal</span>
          <span class="summary-value">${{ subtotal.toFixed(2) }}</span>
        </div>
        
        <div class="summary-row">
          <span class="summary-label">Envío</span>
          <span class="summary-value shipping">{{ shippingCost }}</span>
        </div>
        
        <div class="summary-divider"></div>
        
        <div class="summary-row total">
          <span class="summary-label">Total</span>
          <span class="summary-value">${{ total.toFixed(2) }}</span>
        </div>
        
        <button class="checkout-btn">Proceder a Pagar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cartItems = ref([
  {
    id: 1,
    name: 'Camiseta clásica de algodón',
    size: 'Talla: M',
    price: 25.00,
    quantity: 1,
    image: 'https://media.adeo.com/mkp/91eb909cb95093aec035fd3961c927c5/media.png?width=3000&height=3000&format=jpg&quality=80&fit=bounds'
  },
  {
    id: 2,
    name: 'Zapatillas cómodas para correr',
    size: 'Talla: 8',
    price: 30.00,
    quantity: 1,
    image: 'https://www.venus.com.pe/wp-content/uploads/2025/06/zapatillas-deportivas-para-correr.png'
  }
])

const shippingCost = ref('Free')

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value
})

const increaseQty = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) item.quantity++
}

const decreaseQty = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item && item.quantity > 1) item.quantity--
}

const deleteItem = (id) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.shopping-cart-container {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 40px 20px;
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
  color: #000;
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
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.item-image {
  width: 100px;
  height: 100px;
  background-color: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
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
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 5px;
}

.item-size {
  font-size: 14px;
  color: #777;
  margin-bottom: 8px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: background-color 0.2s;
}

.qty-btn:hover {
  background-color: #e0e0e0;
}

.qty-input {
  width: 40px;
  text-align: center;
  border: none;
  background-color: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.delete-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 18px;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 0.7;
}

/* Order Summary Section */
.order-summary {
  width: 350px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.summary-label {
  color: #666;
  font-weight: 500;
}

.summary-value {
  color: #000;
  font-weight: 500;
}

.summary-value.shipping {
  color: #4CAF50;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

.summary-row.total {
  margin-bottom: 30px;
}

.summary-row.total .summary-label,
.summary-row.total .summary-value {
  font-size: 16px;
  font-weight: 700;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #b3d900;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.checkout-btn:hover {
  background-color: #a3e600;
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

@media (max-width: 640px) {
  .shopping-cart-container {
    padding: 20px 12px;
  }

  .section-title {
    font-size: 24px;
  }

  .cart-item {
    gap: 12px;
    flex-wrap: wrap;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .order-summary {
    padding: 20px;
  }
}
</style>