<template>
  <div>
    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <div class="filter-section">
          <h3 class="filter-title">Filtros</h3>
        </div>

        <div class="filter-section">
          <h4 class="filter-subtitle">Categorías</h4>
          <select class="filter-select">
            <option>Todas las Categorías</option>
            <option>Ropa</option>
            <option>Zapatos</option>
            <option>Accesorios</option>
          </select>
        </div>

        <div class="filter-section">
          <h4 class="filter-subtitle">Rango de Precios</h4>
          <div class="price-range">
            <span>$20</span>
            <span>$200</span>
          </div>
          <input type="range" min="20" max="200" class="range-slider">
        </div>

        <div class="filter-section">
          <h4 class="filter-subtitle">Ordenar Por</h4>
          <select class="filter-select">
            <option>Relevante</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Más Nuevo</option>
          </select>
        </div>
      </aside>

      <!-- Products Section -->
      <section class="products-section">
        <h2 class="products-title">Productos</h2>
        <div class="products-grid">
          <div class="product-card" v-for="product in products" :key="product.id">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
            </div>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="pagination-btn">‹</button>
          <button class="pagination-btn">2</button>
          <button class="pagination-btn">3</button>
          <button class="pagination-btn">...</button>
          <button class="pagination-btn">10</button>
          <button class="pagination-btn">›</button>
        </div>
      </section>
    </div>
    <FloatingAssistantButton />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FloatingAssistantButton from '@/components/FloatingAssistantButton.vue';

const products = ref([
  { id: 1, name: 'Suéter de punto acogedor', price: '$49.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 2, name: 'Jeans Clásicos', price: '$59.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 3, name: 'Botines de cuero', price: '$89.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 4, name: 'Camiseta de algodón', price: '$19.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 5, name: 'Zapatillas deportivas para correr', price: '$79.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 6, name: 'Elegante bufanda de seda', price: '$29.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 7, name: 'Mochila casual de lona', price: '$39.99', image: '/placeholder.svg?height=250&width=250' },
  { id: 8, name: 'Gafas de sol con estilo', price: '$24.99', image: '/placeholder.svg?height=250&width=250' }
])
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

</style>
