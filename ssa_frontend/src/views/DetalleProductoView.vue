<template>
  <div class="product-details-container">
    <!-- Product Image Gallery -->
    <div class="product-gallery">
      <div class="main-image">
        <img :src="mainImage" :alt="product.name" />
      </div>
      <div class="thumbnail-gallery">
        <div
          v-for="(image, index) in product.images"
          :key="index"
          class="thumbnail"
          :class="{ active: mainImage === image }"
          @click="mainImage = image"
        >
          <img :src="image" :alt="`Product view ${index + 1}`" />
        </div>
      </div>
    </div>

    <!-- Product Information -->
    <div class="product-info">
      <h1>{{ product.name }}</h1>
      
      
      <div class="price-section">
          <span class="price">S/{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">S/{{ product.originalPrice }}</span>
        </div>
        
        <p class="description">{{ product.description }}</p>
        
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="review-count">({{ product.reviews }} Reseñas)</span>
        </div>
      <!-- Size Selector -->
      <div class="size-selector">
        <label>Talla:</label>
        <div class="size-options">
          <button
            v-for="size in product.sizes"
            :key="size"
            class="size-btn"
            :class="{ active: selectedSize === size }"
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Color Selector -->
      <div class="color-selector">
        <label>Color:</label>
        <div class="color-options">
          <button
            v-for="color in product.colors"
            :key="color.name"
            class="color-btn"
            :class="{ active: selectedColor === color.name }"
            @click="selectedColor = color.name"
            :style="{ backgroundColor: color.value }"
            :title="color.name"
          />
        </div>
      </div>

      <!-- Quantity Selector -->
      <div class="quantity-selector">
        <label>Cantidad:</label>
        <div class="quantity-control">
          <button @click="quantity = Math.max(1, quantity - 1)">−</button>
          <input v-model.number="quantity" type="number" min="1" />
          <button @click="quantity++">+</button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="add-to-cart-btn" @click="addToCart">
          Agregar al carrito
        </button>
        <button class="wishlist-btn" @click="toggleWishlist">
          ♡
        </button>
      </div>

      <!-- Product Details -->
      <div class="details-section">
        <h3>Detalles del Producto</h3>
        <ul>
          <li><strong>Material:</strong> {{ product.material }}</li>
          <li><strong>Stock:</strong> {{ product.stock }}</li>
          <li><strong>SKU:</strong> {{ product.sku }}</li>
        </ul>
      </div>

      <!-- Shipping & Returns -->
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
</template>

<script>
export default {
  data() {
    return {
      mainImage: 'https://m.media-amazon.com/images/I/41Nl8Zj0e9L._AC_UY1000_.jpg',
      selectedSize: 'M',
      selectedColor: 'Cream',
      quantity: 1,
      product: {
        name: 'Camiseta de algodón premium',
        price: 45.99,
        originalPrice: 59.99,
        reviews: 128,
        description: 'Camiseta de algodón cómoda y con estilo, perfecta para el día a día. Confeccionada en algodón 100% orgánico con un corte holgado.',
        images: [
          'https://pstyletienda.com/wp-content/uploads/2019/11/Camiseta-Hombre-cuello-redondo-basica-Gris-Jaspe-algodon-peinado-Gildan-64000-1.jpg',
          'https://pontela.com.co/187-thickbox_default/camiseta-gildan.jpg',
          'https://static-catalog.tiendamia.com/marketplace_images/production/product_23047_mirakl_image_1.jpg',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Cream', value: '#F5E6D3' },
          { name: 'Black', value: '#1A1A1A' },
          { name: 'Navy', value: '#2C3E50' },
          { name: 'Gray', value: '#A0A0A0' },
        ],
        material: '100% Algodon Organico',
        stock: 5,
        fit: 'Relaxed Fit',
        sku: 'TSH-001-CREAM',
      },
    };
  },
  methods: {
    addToCart() {
      alert(`Added ${this.quantity} item(s) to cart - Size: ${this.selectedSize}, Color: ${this.selectedColor}`);
    },
    toggleWishlist() {
      alert('Added to wishlist!');
    },
  },
};
</script>

<style scoped>
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
  background-color: #f9f9f9;
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
  height: 70%;
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

.thumbnail-gallery {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail.active {
  border-color: #C5E01B;
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

.original-price {
  font-size: 17px;
  color: #999;
  text-decoration: line-through;
}

.description {
  color: #666;
  line-height: 1.6;
  font-size: 15px;
  text-align: left;
}

/* Size Selector */
.size-selector,
.color-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.size-selector label,
.color-selector label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.size-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-btn {
  padding: 10px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.size-btn:hover {
  border-color: #C5E01B;
}

.size-btn.active {
  background-color: #C5E01B;
  border-color: #C5E01B;
  color: #1a1a1a;
}

/* Color Selector */
.color-options {
  display: flex;
  gap: 12px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.color-btn:hover {
  border-color: #ddd;
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #1a1a1a;
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
