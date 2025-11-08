<template>
  <div class="profile-page">
    <HeaderNav /> 
    
    <div class="profile-container">
      
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="profileData.avatar" :alt="profileData.name" />
          <input 
            v-if="isEditing"
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            ref="avatarInput"
            style="display: none"
          />
          <div 
            v-if="isEditing" 
            class="avatar-edit-overlay"
            @click="$refs.avatarInput.click()"
          >
            <button class="avatar-edit-btn">
              <span class="avatar-edit-icon">✏️</span>
            </button>
          </div>
        </div>
        <div class="profile-info">
          <h1>{{ profileData.name }}</h1>
          <p class="profile-email">{{ profileData.email }}</p>
        </div>
        
        <button v-if="!isEditing" @click="toggleEdit" class="edit-btn">
          Editar Perfil
        </button>
        <div v-else class="action-buttons">
          <button @click="saveChanges" class="save-btn">Guardar</button>
          <button @click="toggleEdit" class="cancel-btn">Cancelar</button>
        </div>
      </div>

      <div class="profile-content">
        
        <aside class="profile-sidebar">
          <nav class="sidebar-nav">
            <button
              v-for="section in sections"
              :key="section"
              @click="activeSection = section"
              :class="['nav-item', { active: activeSection === section }]"
            >
              {{ section }}
            </button>
          </nav>
        </aside>

        <main class="profile-main">
          
          <section v-if="activeSection === 'Información Personal'" class="profile-section">
            <h2>Información Personal</h2>
            
            <div class="form-group">
              <label>Nombre Completo</label>
              <input v-if="isEditing" v-model="formData.name" type="text" class="form-input" />
              <span v-else class="form-value">{{ profileData.name }}</span>
            </div>
            
            <div class="form-group">
              <label>Teléfono</label>
              <input v-if="isEditing" v-model="formData.phone" type="tel" class="form-input" />
              <span v-else class="form-value">{{ profileData.phone }}</span>
            </div>
            
            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <input v-if="isEditing" v-model="formData.dateOfBirth" type="date" class="form-input" />
              <span v-else class="form-value">{{ profileData.dateOfBirth }}</span>
            </div>
            
            <div class="form-group">
              <label>Profesión / Actividad</label>
              <input v-if="isEditing" v-model="formData.profession" type="text" class="form-input" />
              <span v-else class="form-value">{{ profileData.profession }}</span>
            </div>
          </section>

          <section v-if="activeSection === 'Dirección'" class="profile-section">
            <h2>Información de Dirección</h2>
            <div class="form-group">
              <label>Calle</label>
              <input v-if="isEditing" v-model="formData.street" type="text" class="form-input" />
              <span v-else class="form-value">{{ profileData.street }}</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ciudad</label>
                <input v-if="isEditing" v-model="formData.city" type="text" class="form-input" />
                <span v-else class="form-value">{{ profileData.city }}</span>
              </div>
              <div class="form-group">
                <label>Estado/Provincia</label>
                <input v-if="isEditing" v-model="formData.state" type="text" class="form-input" />
                <span v-else class="form-value">{{ profileData.state }}</span>
              </div>
            </div>
          </section>

          <section v-if="activeSection === 'Preferencias'" class="profile-section">
            <h2>Preferencias de Compra</h2>
            <p class="section-description">Estos datos son usados por el Motor de Personalización para ofrecerte mejores sugerencias.</p>
            <div class="form-group">
              <label>Color Favorito</label>
              <div v-if="isEditing" class="color-grid">
                <label v-for="color in colors" :key="color.name" class="color-option">
                  <input 
                    type="radio" 
                    v-model="formData.favoriteColor" 
                    :value="color.value"
                    hidden
                  >
                  <div 
                    class="color-box" 
                    :style="{ backgroundColor: color.value }"
                    :class="{ selected: formData.favoriteColor === color.value }"
                  ></div>
                  <span>{{ color.name }}</span>
                </label>
              </div>
              <span v-else class="form-value">
                <span class="color-box" :style="{ backgroundColor: profileData.favoriteColor }"></span>
                {{ getColorName(profileData.favoriteColor) }}
              </span>
            </div>
            <div class="form-group">
              <label>Estilo Preferido</label>
              <select v-if="isEditing" v-model="formData.style" class="form-input">
                <option>Casual</option>
                <option>Formal</option>
                <option>Deportivo</option>
                <option>Vintage</option>
              </select>
              <span v-else class="form-value">{{ profileData.style }}</span>
            </div>
          </section>
          
          <section v-if="activeSection === 'Historial y Pedidos'" class="profile-section">
            <h2>Historial de Pedidos</h2>
            <p class="section-description">Consulta el estado de tus últimos pedidos y el historial usado por la IA.</p>
            <div v-if="profileData.recentOrders.length > 0">
              <div v-for="order in profileData.recentOrders" :key="order.id" class="order-item">
                <p>Pedido #{{ order.id }} - <strong>{{ order.date }}</strong></p>
                <p class="order-status">Estado: <span :class="{'status-enviado': order.status === 'Enviado', 'status-entregado': order.status === 'Entregado'}">{{ order.status }}</span></p>
                <p>Total: S/{{ order.total.toFixed(2) }}</p>
                <button class="detail-btn">Ver Detalles</button>
              </div>
            </div>
            <p v-else>Aún no tienes pedidos recientes para mostrar.</p>
          </section>
          
          <section v-if="activeSection === 'Configuración de IA'" class="profile-section">
            <h2>Configuración de IA y Privacidad</h2>
            <div class="form-group">
              <label>Consentimiento para Recomendaciones</label>
              <p class="privacy-note">
                Permite al SSA usar tu historial para ofrecer sugerencias más precisas.
              </p>
              <input v-if="isEditing" v-model="formData.aiConsent" type="checkbox" class="checkbox-input" />
              <span v-else class="form-value">
                {{ profileData.aiConsent ? 'ACTIVO' : 'INACTIVO' }}
              </span>
            </div>
            <div class="form-group">
              <label>Frecuencia de Notificaciones de Ofertas</label>
              <select v-if="isEditing" v-model="formData.notificationFrequency" class="form-input">
                <option>Diario</option>
                <option>Semanal</option>
                <option>Mensual</option>
                <option>Desactivado</option>
              </select>
              <span v-else class="form-value">{{ profileData.notificationFrequency }}</span>
            </div>
          </section>

          <section v-if="activeSection === 'Seguridad'" class="profile-section">
            <h2>Configuración de Seguridad</h2>
            <div class="form-group">
              <label>Contraseña Actual</label>
              <input v-if="isEditing" v-model="securityData.currentPassword" type="password" class="form-input" placeholder="Ingresa tu contraseña actual" />
            </div>
            <div class="form-group">
              <label>Nueva Contraseña</label>
              <input v-if="isEditing" v-model="securityData.newPassword" type="password" class="form-input" placeholder="Ingresa una nueva contraseña" />
            </div>
            <div class="form-group">
              <label>Confirmar Contraseña</label>
              <input v-if="isEditing" v-model="securityData.confirmPassword" type="password" class="form-input" placeholder="Confirma tu nueva contraseña" />
            </div>
            <p v-if="!isEditing" class="security-info">
              Último cambio de contraseña: {{ profileData.lastPasswordChange }}
            </p>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeSection = ref('Información Personal');
const isEditing = ref(false);

const sections = [
  'Información Personal', 
  'Dirección', 
  'Preferencias', 
  'Historial y Pedidos', 
  'Configuración de IA',
  'Seguridad'
];

const colors = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Azul', value: '#0066CC' },
  { name: 'Verde', value: '#00AA44' },
  { name: 'Rojo', value: '#CC0000' },
  { name: 'Gris', value: '#666666' },
  { name: 'Rosa', value: '#FF69B4' },
  { name: 'Naranja', value: '#FF9900' }
];

const getColorName = (colorValue) => {
  const color = colors.find(c => c.value.toLowerCase() === colorValue.toLowerCase());
  if (color) return color.name;
  
  const similarColor = colors.find(c => colorValue.toLowerCase().includes(c.value.toLowerCase()) || 
                                      c.value.toLowerCase().includes(colorValue.toLowerCase()));
  return similarColor ? similarColor.name : colorValue;
};

const profileData = ref({
  name: 'Juan García',
  email: 'juan.garcia@email.com',
  phone: '+51 987 654 321',
  dateOfBirth: '1990-05-15',
  profession: 'Ingeniero de Software', 
  avatar: 'https://i.pinimg.com/236x/51/f1/c4/51f1c4cf7b732a99471d0beca326d666.jpg',
  street: 'Av. Primavera 123',
  city: 'Trujillo',
  state: 'La Libertad',
  postalCode: '13001',
  country: 'Perú',
  favoriteColor: '#0066CC',
  style: 'Casual',
  aiConsent: true, 
  notificationFrequency: 'Semanal',
  lastPasswordChange: '15 de Octubre de 2024',
  recentOrders: [
    { id: 'SF12345', date: '2025-10-20', status: 'Enviado', total: 150.90 },
    { id: 'SF12344', date: '2025-09-01', status: 'Entregado', total: 75.00 },
  ]
});

const formData = ref({ ...profileData.value }); 
const securityData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido');
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('La imagen no debe superar los 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const imageUrl = URL.createObjectURL(file);
    profileData.value.avatar = imageUrl;
    formData.value.avatarFile = file;
    
   
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    alert('Error al subir la imagen. Por favor intenta de nuevo.');
  }
};

const fetchProfileData = async () => {
    console.log("Cargando datos del perfil desde Django...");
};


const toggleEdit = () => {
  if (isEditing.value) {
    formData.value = { ...profileData.value };
    securityData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    if (activeSection.value === 'Seguridad') activeSection.value = 'Información Personal'; 
  }
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
  if (securityData.value.newPassword && securityData.value.newPassword !== securityData.value.confirmPassword) {
    alert('Error: Las nuevas contraseñas no coinciden.');
    return;
  }
  
  let dataToSend = new FormData();
  
  Object.keys(formData.value).forEach(key => {
    if (key !== 'avatarFile') {
      dataToSend.append(key, formData.value[key]);
    }
  });

  if (securityData.value.newPassword) {
    dataToSend.append('current_password', securityData.value.currentPassword);
    dataToSend.append('new_password', securityData.value.newPassword);
  }

  if (formData.value.avatarFile) {
    dataToSend.append('avatar', formData.value.avatarFile);
  }

  try {
    profileData.value = { ...formData.value }; 
    alert('¡Perfil actualizado exitosamente!');
    isEditing.value = false;
    
  } catch (error) {
    alert('Error al guardar: El servidor rechazó los datos.');
    console.error('Error al guardar:', error);
  }
};

fetchProfileData();
</script>

<style scoped>
.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  margin-top: 16px;
  margin-left: 16px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-edit-overlay:hover {
  opacity: 1;
}

.avatar-edit-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #C5E01B;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar-edit-btn:hover {
  background: #b8d400;
}

.avatar-edit-icon {
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.profile-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.profile-avatar img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
}
.profile-info {
  flex: 1;
}
.profile-email {
  font-size: 14px;
  color: #666;
}
.edit-btn, .save-btn, .cancel-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.edit-btn, .save-btn {
  background-color: #C5E01B;
  color: #1a1a1a;
}
.edit-btn:hover, .save-btn:hover {
  background-color: #b8d400;
}
.cancel-btn {
  background-color: #e0e0e0;
  color: #1a1a1a;
}
.action-buttons {
  display: flex;
  gap: 10px;
}

.profile-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}
.profile-sidebar {
  background: white;
  padding: 20px 0;
  border-radius: 8px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.nav-item {
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-left: 3px solid transparent;
  font-weight: 500;
}
.nav-item.active {
  color: #C5E01B;
  border-left-color: #C5E01B;
  background-color: #fafaf5;
}
.profile-main {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.profile-section h2 {
  font-size: 22px;
  margin: 0 0 24px 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 16px;
}
.section-description {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}
.form-value {
  display: block;
  padding: 12px;
  color: #1a1a1a;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}
.color-box {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  margin-right: 10px;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.color-option .color-box {
  margin: 0;
}

.color-option .color-box.selected {
  border-color: #C5E01B;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.2);
}

.color-option span {
  font-size: 12px;
  color: #666;
  text-align: center;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.security-info {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

.order-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-status {
  font-weight: 600;
  min-width: 100px;
  text-align: center;
}
.status-enviado {
  color: orange;
}
.status-entregado {
  color: green;
}
.detail-btn {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.privacy-note {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}
</style>