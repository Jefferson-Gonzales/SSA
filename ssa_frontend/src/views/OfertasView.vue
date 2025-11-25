<template>
  <div class="ofertas-page">
    <h2>Ofertas y promociones</h2>

    <div v-if="loading" class="loading">
      Cargando ofertas...
    </div>

    <div v-else-if="productos.length === 0" class="empty">
      No hay ofertas disponibles en este momento.
    </div>

    <div v-else class="grid">
      <div
        v-for="producto in productos"
        :key="producto.idproducto"
        class="card"
        @click="openProduct(producto)"
      >
        <div class="badge">OFERTA</div>
        <h3>{{ producto.nombre }}</h3>
        <p class="categoria">{{ producto.categoriaNombre }}</p>

        <div class="precios">
          <span class="precio-oferta">S/ {{ producto.precioOferta ?? producto.precioBase }}</span>
          <span v-if="producto.enOferta && producto.precioOferta" class="precio-base">
            S/ {{ producto.precioBase }}
          </span>
        </div>
        <!-- 🔹 Aquí conectamos el botón al método verDetalle 
        <button
          class="btn-comprar"
          @click="verDetalle(producto)">
          Ver detalle
        </button>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';



export default {
  name: 'OfertasView',
  data() {
    return {
      productos: [],
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const { data } = await axios.get('http://localhost:8080/api/productos/ofertas');
      console.log("OFERTAS =>", data); // para verificar idProducto
      this.productos = data;
    } catch (e) {
      console.error('Error cargando ofertas:', e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    openProduct(product) {
      // 1. Intentar ambos posibles nombres de campo (idproducto / idProducto)
      const productId = product?.idproducto || product?.idProducto;

      // 2. VERIFICAR que el ID existe antes de navegar.
      if (productId) {
        // Usar this.$router dentro de componentes Vue para navegar.
        this.$router.push({
          name: 'detalle',
          params: { id: productId }
        });
      } else {

        alert('No se pudo cargar la información del producto. Inténtalo de nuevo.');
      }
    }
  }
};

</script>

<style scoped>
.ofertas-page {
  padding: 24px 32px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
}

.card {
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  border: 1px solid #eee;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff5252;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
}

.precios {
  margin: 8px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.precio-oferta {
  font-size: 18px;
  font-weight: 700;
  color: #e53935;
}

.precio-base {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.btn-comprar {
  margin-top: 8px;
  width: 100%;
  border: none;
  border-radius: 6px;
  background: #b3e34f;
  padding: 8px 0;
  font-weight: 600;
  cursor: pointer;
}
</style>
