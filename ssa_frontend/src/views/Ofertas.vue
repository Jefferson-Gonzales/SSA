<template>
    <div class="offers-page">
    <section class="hero-banner">
      <div class="hero-content">
        <h2 class="hero-title">Ofertas Exclusivas</h2>
        <p class="hero-description">Descubre nuestras últimas promociones y ahorra en tus artículos favoritos. ¡Tiempo limitado!</p>
        <button class="btn-primary">Comprar Ahora</button>
      </div>
      <div class="hero-carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">Promociones Actuales</h3>
      <div class="promotions-grid-3">
        <div class="promotion-card" v-for="promo in currentPromos" :key="promo.id">
          <img :src="promo.image" :alt="promo.title" class="promo-image">
          <div class="promo-content">
            <h4 class="promo-title">{{ promo.title }}</h4>
            <p class="promo-description">{{ promo.description }}</p>
            <p class="promo-validity">Válido hasta: {{ promo.validity }}</p>
            <button :class="['promo-btn', promo.buttonType]">{{ promo.buttonText }}</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">Todas las Promociones</h3>
      <div class="promotions-grid-4">
        <div class="promotion-card" v-for="promo in allPromos" :key="promo.id">
          <img :src="promo.image" :alt="promo.title" class="promo-image">
          <div class="promo-content">
            <h4 class="promo-title">{{ promo.title }}</h4>
            <p class="promo-description">{{ promo.description }}</p>
            <p class="promo-validity">Válido hasta: {{ promo.validity }}</p>
            <button class="promo-btn details">{{ promo.buttonText }}</button>
          </div>
        </div>
      </div>
    </section>

    </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'OfertasPage',
  setup() {
    const currentPromos = ref([
  {
    id: 1,
    title: 'Venta Flash de Moda',
    description: 'Hasta 50% de descuento en ropa seleccionada.',
    validity: '31/12/2024',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvr-vStQj_P8bcZ4P6lNVz2jJ48Z8LzO7pT7qjBE-uR8cUYWg5gVAH4IluW8TT4jVQEXo&usqp=CAU',
    buttonText: 'Aplicar Promoción',
    buttonType: 'primary'
  },
  {
    id: 2,
    title: 'Ofertas de Tecnología',
    description: 'Ahorra a lo grande en los últimos gadgets.',
    validity: '25/12/2024',
    image: 'https://marketplace.canva.com/EAGwofD9cNk/1/0/1131w/canva-flyer-volante-oferta-de-inform%C3%A1tica-publicitario-moderno-azul-y-naranja-E93hsZUwQS8.jpg',
    buttonText: 'Ver Detalles',
    buttonType: 'secondary'
  },
  {
    id: 3,
    title: 'Esenciales del Hogar',
    description: 'Renueva tu hogar con nuestras ofertas especiales.',
    validity: '30/11/2024',
    image: 'https://via.placeholder.com/300x200/C8D9C3/000000?text=Hogar',
    buttonText: 'Aplicar Promoción',
    buttonType: 'primary'
  }
  ])

  const allPromos = ref([
  {
    id: 4,
    title: 'Oferta de Estilo Veraniego',
    description: 'Prepárate para el verano con nuestra colección con estilo.',
    validity: '31/08/2024',
    image: 'https://via.placeholder.com/300x200/F5DEB3/000000?text=Verano',
    buttonText: 'Ver Detalles'
  },
  {
    id: 5,
    title: 'Evento de Actualización Tecnológica',
    description: 'Actualiza tu tecnología con los últimos dispositivos.',
    validity: '15/09/2024',
    image: 'https://via.placeholder.com/300x200/A8D5BA/000000?text=Tech',
    buttonText: 'Ver Detalles'
  },
  {
    id: 6,
    title: 'Ofertas de Renovación del Hogar',
    description: 'Transforma tu hogar con nuestra selección curada.',
    validity: '30/09/2024',
    image: 'https://via.placeholder.com/300x200/5A7D6F/FFFFFF?text=Renovación',
    buttonText: 'Ver Detalles'
  },
  {
    id: 7,
    title: 'Equipo de Aventura al Aire Libre',
    description: 'Equipo de alta calidad para tu próxima aventura.',
    validity: '10/10/2024',
    image: 'https://via.placeholder.com/300x200/3D5A3D/FFFFFF?text=Aventura',
    buttonText: 'Ver Detalles'
  }
    ])

    return { currentPromos, allPromos }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #4a6b5f 0%, #3d5a4f 100%);
  color: white;
  padding: 60px 40px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-banner::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: url('https://via.placeholder.com/600x300') center/cover;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 50%;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
}

.hero-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
  opacity: 0.95;
  text-align: left;
}

.btn-primary {
  background-color: #b3d900;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: fit-content;
}

.btn-primary:hover {
  background-color: #9ab800;
}

.hero-carousel-dots {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: white;
}

/* Sections */
.section {
  padding: 40px 30px;
  background-color: white;
  margin: 30px;
  border-radius: 10px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #000;
}

/* Promotion Grids */
.promotions-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.promotions-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Promotion Card */
.promotion-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  border: 1px solid #e0e0e0;
}

.promotion-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.promo-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.promo-content {
  padding: 20px;
}

.promo-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
}

.promo-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
}

.promo-validity {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.promo-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.promo-btn.primary {
  background-color: #b3d900;
  color: white;
}

.promo-btn.primary:hover {
  background-color: #9ab800;
}

.promo-btn.secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.promo-btn.secondary:hover {
  background-color: #e8e8e8;
}

.promo-btn.details {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.promo-btn.details:hover {
  background-color: #e8e8e8;
}

/* Floating Chat Button */
.floating-chat-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #b3d900;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
}

.floating-chat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .promotions-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .nav {
    gap: 15px;
  }

  .hero-banner {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-content {
    max-width: 100%;
  }

  .promotions-grid-3 {
    grid-template-columns: 1fr;
  }

  .promotions-grid-4 {
    grid-template-columns: 1fr;
  }

  .section {
    margin: 20px;
    padding: 20px;
  }
}
</style>