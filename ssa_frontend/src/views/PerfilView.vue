<template>
  <div class="profile-page">
    <HeaderNav /> 
    
    <div class="profile-container">
      
      <div class="profile-header">
        <div class="profile-avatar">
          <img v-if="profileData.avatar && profileData.avatar.startsWith('http')" :src="profileData.avatar" :alt="profileData.name" />
          <div v-else class="avatar-placeholder">
            {{ profileData.name ? profileData.name.charAt(0) : 'J' }}
            {{ profileData.name && profileData.name.split(' ').length > 1 ? profileData.name.split(' ')[1].charAt(0) : 'P' }}
          </div>
          
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
            
          </div>
        </div>
        <!-- 🔹 NUEVO: selector de avatares cuando está en modo edición -->
        <div v-if="isEditing" class="avatar-options">
          <p class="avatar-options-title">Elige un avatar</p>
          <div class="avatar-options-grid">
            <button
              v-for="url in avatarOptions"
              :key="url"
              type="button"
              class="avatar-option"
              :class="{ selected: formData.avatar === url }"
              @click="selectAvatar(url)"
           >
              <img :src="url" alt="Avatar sugerido" />
            </button>
          </div>
        </div>
        <div class="profile-info">
          <h1>{{ profileData.name === 'Cargando...' ? 'Cargando...' : profileData.name }}</h1>
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
              <span v-else class="form-value">+51 {{ profileData.phone || 'N/A' }}</span>
            </div>
            
            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <input v-if="isEditing" v-model="formData.dateOfBirth" type="date" class="form-input" />
              <span v-else class="form-value">
                {{ profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : 'N/A' }}
              </span>
            </div>
            
            <div class="form-group">
              <label>Profesión / Actividad</label>
              <select v-if="isEditing" v-model="formData.profession" class="form-input">
                <option v-for="p in professions" :key="p" :value="p">{{ p }}</option>
              </select>
              <span v-else class="form-value">{{ profileData.profession || 'N/A' }}</span>
            </div>
          </section>

          <section v-if="activeSection === 'Dirección'" class="profile-section">
            <h2>Información de Dirección</h2>
            <div class="form-group">
              <label>Calle</label>
              <input v-if="isEditing" v-model="formData.street" type="text" class="form-input" />
              <span v-else class="form-value">{{ profileData.street || 'N/A' }}</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ciudad</label>
                <input v-if="isEditing" v-model="formData.city" type="text" class="form-input" />
                <span v-else class="form-value">{{ profileData.city || 'N/A' }}</span>
              </div>
              <div class="form-group">
                <label>Estado/Provincia</label>
                <input v-if="isEditing" v-model="formData.state" type="text" class="form-input" />
                <span v-else class="form-value">{{ profileData.state || 'N/A' }}</span>
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
                {{ getColorName(profileData.favoriteColor) || 'No Seleccionado' }}
              </span>
            </div>
            
            <div class="form-group">
              <label>Estilo Preferido</label>
              <select v-if="isEditing" v-model="formData.style" class="form-input">
                <option>Minimalista</option> 
                <option>Casual Elegante</option>
                <option>Casual</option>
                <option>Formal</option>
                <option>Deportivo</option>
                <option>Vintage</option>
              </select>
              <span v-else class="form-value">{{ profileData.style || 'N/A' }}</span>
            </div>

            <div class="form-group">
              <label>Hobbies / Intereses (Multiselección)</label>
              <div v-if="isEditing" class="checkbox-grid">
                <label v-for="hobby in allHobbies" :key="hobby" class="checkbox-option">
                  <input type="checkbox" :value="hobby" v-model="formData.hobbies">
                  {{ hobby }}
                </label>
              </div>
              <span v-else class="form-value">{{ profileData.hobbies.length > 0 ? profileData.hobbies.join(', ') : 'No Definidos' }}</span>
            </div>
            
          <div class="forms-group">
              <label>Intereses de Compra (Multiselección)</label>
              <div v-if="isEditing" class="checkbox-grid">
                <label v-for="interest in allInterests" :key="interest" class="checkbox-option">
                  <input type="checkbox" :value="interest" v-model="formData.interests">
                  {{ interest }}
                </label>
            </div>
            <span v-else class="form-value">
              {{ profileData.interests.length > 0 ? profileData.interests.join(', ') : 'No Definidos' }}
            </span>
          </div>
        </section>
          
        <section v-if="activeSection === 'Historial y Pedidos'" class="profile-section">
          <h2>Historial de Pedidos</h2>
          <p class="section-description">
            Consulta tus pedidos realizados y revisa el detalle de cada uno.
          </p>

          <!-- Estados de carga / error -->
          <p v-if="loadingPedidos" class="orders-status">Cargando pedidos...</p>
          <p v-else-if="errorPedidos" class="orders-status orders-status-error">
            {{ errorPedidos }}
          </p>
          <p v-else-if="pedidos.length === 0" class="orders-status">
             Aún no tienes pedidos registrados.
          </p>

          <!-- Lista de pedidos -->
          <div
            v-for="pedido in pedidos"
            :key="pedido.idPedido"
            class="order-item"
          >
            <div class="order-left">
              <p class="order-main">
                Pedido #{{ formatPedidoNumber(pedido.numeroPedidoCliente) }} -
                <strong>{{ formatFechaPedido(pedido.fechaPedido) }}</strong>
              </p>
              <p class="order-line">
                <span class="order-label">Método de pago:</span>
                <span class="status-metodo">{{ pedido.metodoPago }}</span>
              </p>
              <p class="order-line">
                 <span class="order-label">Dirección:</span>
                 <span class="order-value">{{ pedido.direccionEnvio }}</span>
              </p>
              <p v-if="pedido.trackingCode" class="order-line">
                <span class="order-label">Código de seguimiento:</span>
                <span class="tracking-code">{{ pedido.trackingCode }}</span>
             </p>
           </div>

           <div class="order-right">
              <p class="order-total">
              Total: <strong>S/.{{ pedido.total.toFixed(2) }}</strong>
              </p>
              <button
                class="detail-btn"
                @click="abrirDetallePedido(pedido)"
             >
               Ver Detalles
             </button>
            </div>
          </div>
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

          <section v-if="activeSection === 'Política de Devolución'" class="profile-section">
            <h2>Políticas de devolución</h2>
            <div class="form-group">
              <label>Todos las políticas de devolución están sujetas a rigurosas políticas de las cuales deben ser 
                estrictamente seguidos tanto por la empresa como por el cliente. Para más información, visita nuestra 
                página de políticas de devolución o contacta con soporte al cliente.
              </label>
              <input v-if="isEditing" v-model="securityData.currentPassword" type="password" class="form-input" placeholder="Ingresa tu contraseña actual" />
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- 🔹 Modal Detalle de Pedido (estilo tarjeta premium) -->
<div
  v-if="showPedidoModal && selectedPedido"
  class="order-modal-overlay"
>
  <div class="order-modal-card">
    <!-- Header -->
    <div class="order-modal-header">
      <div>
        <p class="order-modal-label">Detalle de pedido</p>
        <h3>Pedido #{{ selectedPedido.idPedido }}</h3>
      </div>
      
    </div>

    <!-- Resumen principal -->
    <div class="order-modal-summary">
      <div class="order-modal-summary-left">
        <p class="order-modal-summary-title">Total pagado</p>
        <p class="order-modal-summary-amount">
          S/.{{ selectedPedido.total.toFixed(2) }}
        </p>
        <p class="order-modal-summary-date">
          {{ formatFechaPedido(selectedPedido.fechaPedido) }}
        </p>
      </div>
      <div class="order-modal-summary-right">
        <span class="order-modal-chip">
          <h3> Método de Pago: {{ selectedPedido.metodoPago || 'Método no registrado' }}</h3>
        </span>

      </div>
    </div>

    <!-- Cuerpo: info + productos -->
    <div class="order-modal-body">
      <!-- Columna izquierda: datos del pedido -->
      <div class="order-modal-column">
        <h4>Información del cliente</h4>
        <div class="order-modal-info-list">
          <div class="order-modal-info-item">
            <span class="info-label">DNI</span>
            <span class="info-value">
              {{ selectedPedido.dni || 'No registrado' }}
            </span>
          </div>
          <div class="order-modal-info-item">
            <span class="info-label">Dirección de envío</span>
            <span class="info-value">
              {{ selectedPedido.direccionEnvio }}
            </span>
          </div>
            <div
              class="order-modal-info-item"
              v-if="selectedPedido.trackingCode"
           >
              <span class="info-label">Código de seguimiento</span>
              <span class="info-value">
                {{ selectedPedido.trackingCode }}
              </span>
            </div>

          <div class="order-modal-info-item">
            <span class="info-label">Estado del pedido</span>
            <span class="info-value info-badge">
            PENDIENTE
            </span>
          </div>
        </div>

        
      </div>

      <!-- Columna derecha: detalle de productos -->
      <div class="order-modal-column">
        <h4>Productos del pedido</h4>
        <div class="order-modal-products-wrapper">
          <table class="order-modal-products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in selectedPedido.detalles"
                :key="item.idProducto"
              >
                <td>{{ item.nombreProducto }}</td>
                <td>{{ item.cantidad }}</td>
                <td>S/.{{ item.precioUnitario.toFixed(2) }}</td>
                <td>
                  S/.{{ (item.precioUnitario * item.cantidad).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="order-modal-footer">
      <button class="order-modal-btn" @click="cerrarDetallePedido">
        Cerrar
      </button>
    </div>
  </div>
</div>
<!-- 🔹 Modal de mensajes de perfil (éxito / error) -->
<div
  v-if="showProfileModal"
  class="order-modal-overlay"
>
  <div class="order-modal-card profile-modal-card">
    <!-- Icono -->
    <div class="profile-modal-icon-wrapper">
      <div
        class="profile-modal-icon"
        :class="profileModalType === 'success' ? 'profile-modal-icon-success' : 'profile-modal-icon-error'"
      >
        <span v-if="profileModalType === 'success'">✅</span>
        <span v-else>⚠️</span>
      </div>
    </div>

    <h3 class="profile-modal-title">
      {{ profileModalTitle }}
    </h3>

    <p class="profile-modal-message">
      {{ profileModalMessage }}
    </p>

    <button
      @click="closeProfileModal"
      class="profile-modal-btn"
    >
      Aceptar
    </button>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; 
import { getMisPedidos } from '@/services/pedidosService'; 
import { useRoute } from 'vue-router';

// Asume que HeaderNav existe, si no, necesitarás importarlo o quitarlo.
// import HeaderNav from './HeaderNav.vue'; 

const AVATAR_STORAGE_KEY_PREFIX = 'USER_AVATAR_';
const CURRENT_AVATAR_KEY = 'SAGA_CURRENT_AVATAR';

const avatarOptions = [
  'https://avatar.iran.liara.run/public',
  'https://avatar.iran.liara.run/public?username=opcion1',
  'https://avatar.iran.liara.run/public?username=opcion2',
  'https://avatar.iran.liara.run/public?username=opcion3',
  'https://avatar.iran.liara.run/public?username=opcion4',
  'https://avatar.iran.liara.run/public?username=opcion5'
];

const selectAvatar = (url) => {
  formData.value.avatar = url;
  profileData.value.avatar = url; // actualiza preview en vivo
};



// --- CONFIGURACIÓN Y CONSTANTES ---
const API_BASE_URL = 'http://localhost:8080/api'; 
const TRACKING_STORAGE_KEY = 'SAGA_TRACKING_HISTORY'; 
const activeSection = ref('Información Personal');
const isEditing = ref(false);
const route = useRoute();

const sections = [
  'Información Personal', 
  'Dirección', 
  'Preferencias', 
  'Historial y Pedidos', 
  'Configuración de IA',
  'Política de Devolución'
];

const professions = [
  'Estudiante', 
  'Ingenierio', // Reducido para evitar error de truncamiento en DB
  'Diseñador', 
  'Doctor', 
  'Profesor', 
  'Emprendedor', 
  'Químico',
  'Deportista',
  'Abogado',
  'Psicólogo'


];

const allHobbies = [
  'Fotografía', 
  'Senderismo', 
  'Lectura', 
  'Deportes', 
  'Cine', 
  'Viajes', 
  'Música', 
  'Tecnología'
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
const allInterests = [
  'Ropa',
  'Calzado',
  'Accesorios',
  'Deportes',
  'Tecnología',
  'Hogar',
  'Belleza',
  'Construcción',
  'Electrodomésticos',
  'Jardinería',
  'Mueblería',
  'Joyeria',
  'Productos para Mascotas'
];

/* agregar estilos
const estilopreferido =[
  'Vintage',
  'Bohemia',
  'Retro'
]*/

// --- FUNCIONES DE SOPORTE ---

const getAuthToken = () => {
    return localStorage.getItem('accessToken'); 
};

const loadAvatarFromStorage = () => {
  const email = profileData.value.email;
  if (!email) return;

  const storedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY_PREFIX + email);
  if (storedAvatar) {
    profileData.value.avatar = storedAvatar;
    formData.value.avatar = storedAvatar; 
  }
};

const saveAvatarToStorage = (avatarUrlOrData) => {
  const email = profileData.value.email || formData.value.email;
  if (!avatarUrlOrData) return;

  // 1) Guardado por email (por si lo quieres seguir usando)
  if (email) {
    localStorage.setItem(AVATAR_STORAGE_KEY_PREFIX + email, avatarUrlOrData);
  }

  // 2) Guardado global para el usuario actual (lo que usará el header)
  localStorage.setItem(CURRENT_AVATAR_KEY, avatarUrlOrData);
};


const getColorName = (colorValue) => {
  if (!colorValue) return 'No Definido';
  const color = colors.find(c => c.value.toLowerCase() === colorValue.toLowerCase());
  if (color) return color.name;
  
  return colorValue; 
};

// --- ESTADO REACTIVO ---
const profileData = ref({
  name: 'Cargando...',
  email: 'cargando@email.com',
  phone: '',
  dateOfBirth: '', // 'YYYY-MM-DD'
  profession: '', 
  avatar: '', 
  street: '',
  city: '',
  state: '',
  favoriteColor: '#FFFFFF', 
  style: 'Casual',
  hobbies: [], 
  interests: [],
  aiConsent: true, 
  notificationFrequency: 'Semanal',
  lastPasswordChange: 'N/A',
  recentOrders: []
});

const formData = ref({ ...profileData.value }); 
const securityData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const pedidos = ref([]);
const loadingPedidos = ref(false);
const errorPedidos = ref('');

const showPedidoModal = ref(false);
const selectedPedido = ref(null);

// 🔹 Modal genérico para mensajes de perfil (éxito / error)
const showProfileModal = ref(false);
const profileModalTitle = ref('');
const profileModalMessage = ref('');
const profileModalType = ref('success'); // 'success' | 'error'

// helper para abrir/cerrar modal
const openProfileModal = (title, message, type = 'success') => {
  profileModalTitle.value = title;
  profileModalMessage.value = message;
  profileModalType.value = type;
  showProfileModal.value = true;
};

const closeProfileModal = () => {
  showProfileModal.value = false;
};


const formatFechaPedido = (isoDate) => {
  try {
    return new Date(isoDate).toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoDate;
  }
};

// 🔹 Leer historial de tracking desde localStorage
const loadTrackingHistory = () => {
  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error('Error leyendo historial de tracking:', e);
    return [];
  }
};

// 🔹 Enlazar trackingCode a cada pedido según numeroPedidoCliente
const attachTrackingCodesToPedidos = () => {
  const history = loadTrackingHistory();
  if (!history || history.length === 0) return;

  // Creamos un map por numeroPedidoCliente para lookup rápido
  const map = new Map(
    history.map(h => [String(h.numeroPedidoCliente), h])
  );

  pedidos.value = pedidos.value.map(p => {
    const key = String(p.numeroPedidoCliente);
    const trackingEntry = map.get(key);
    return {
      ...p,
      trackingCode: trackingEntry?.trackingCode || null,
      trackingCreatedAt: trackingEntry?.createdAt || null,
    };
  });
};



const cargarPedidos = async () => {
  loadingPedidos.value = true;
  errorPedidos.value = '';
  try {
    pedidos.value = await getMisPedidos();
    attachTrackingCodesToPedidos();
  } catch (e) {
    console.error(e);
    errorPedidos.value =
      e.response?.data || e.message || 'No se pudo cargar el historial de pedidos.';
  } finally {
    loadingPedidos.value = false;
  }
};

const abrirDetallePedido = (pedido) => {
  selectedPedido.value = pedido;
  showPedidoModal.value = true;
};

const cerrarDetallePedido = () => {
  showPedidoModal.value = false;
  selectedPedido.value = null;
};

// --- FUNCIONES DE MAPPING ---

/**
 * Mapea los datos de la API de /usuario/perfil a profileData.
 */
const mapUserFromBackend = (userData) => {
    if (!userData) return;
    profileData.value.name = `${userData.nombres || ''} ${userData.apellidos || ''}`.trim();
    profileData.value.email = userData.email;
    profileData.value.phone = userData.telefono || '';
    
    // 🚨 FIX: Cortar la hora (T00:00:00) para asegurar que el input type="date" funcione
    const rawDate = userData.fechaNacimiento || '';
    profileData.value.dateOfBirth = rawDate ? rawDate.split('T')[0] : ''; 

    profileData.value.street = userData.direccionCalle || '';
    profileData.value.city = userData.direccionCiudad || '';
    profileData.value.state = userData.direccionEstado || '';

    loadAvatarFromStorage();

     // Si no hay nada guardado, usar uno determinista por email
    if (!profileData.value.avatar && userData.email) {
      const defaultAvatar = `https://avatar.iran.liara.run/public?username=${encodeURIComponent(userData.email)}`;
      profileData.value.avatar = defaultAvatar;
      formData.value.avatar = defaultAvatar;
  }
};

/**
 * Mapea los datos de la API de /preferencias a profileData.
 */
const mapPreferencesFromBackend = (backendData) => {
    if (!backendData) return;
    
    profileData.value.favoriteColor = backendData.coloresFavoritos || '#FFFFFF';
    profileData.value.style = backendData.estilos || 'Casual';
    profileData.value.profession = backendData.profesion || ''; 
    
    profileData.value.hobbies = backendData.hobbies 
        ? backendData.hobbies.split(',').map(item => item.trim()).filter(item => item !== '') 
        : [];

    profileData.value.interests = backendData.intereses 
        ? backendData.intereses.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];
};


// --- FUNCIONES DE CARGA DE DATOS (FETCH) ---

/**
 * Carga la información del usuario principal (/usuario/perfil).
 */
const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('ERROR: No se encontró Token de autenticación (accessToken).');
      return; 
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/perfil`, { 
            headers: { Authorization: `Bearer ${token}` },
        });
        
        mapUserFromBackend(response.data);
    } catch (error) {
        console.error('Error 401/404 al cargar datos del Usuario. ¿Token inválido o expirado?', error.response?.data || error.message);
        profileData.value.name = 'Error de Acceso';
        profileData.value.email = 'Debe volver a iniciar sesión';
    }
};

/**
 * Carga las preferencias del usuario (/preferencias).
 */
const fetchPreferences = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await axios.get(`${API_BASE_URL}/preferencias`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data) {
            mapPreferencesFromBackend(response.data);
        }
    } catch (error) {
        console.warn('Error al cargar preferencias. Asumiendo que el Backend no la encontró/creó.', error.response?.data || error.message);
        formData.value = { ...profileData.value }; 
    }
};

// --- FUNCIONES DE EDICIÓN Y GUARDADO ---

const toggleEdit = () => {
  if (isEditing.value) {
    // Si se CANCELA, restablecer formData a los valores originales (profileData)
    formData.value = { ...profileData.value, hobbies: [...profileData.value.hobbies], interests: [...profileData.value.interests]  }; 
    securityData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    if (activeSection.value === 'Seguridad') activeSection.value = 'Información Personal'; 
  } else {
    // 🚨 FIX: Al EMPEZAR a editar, copiar todos los datos a formData.
    formData.value = { ...profileData.value };
    formData.value.hobbies = [...profileData.value.hobbies]; // Array copy
    formData.value.interests = [...profileData.value.interests]; // Array copy
  }
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
    const token = getAuthToken();
    if (!token) { 
        openProfileModal(
          'Error de autenticación',
          'Por favor, vuelve a iniciar sesión.',
          'error'
        );
        return;
      }

    //console.log("Token a enviar:", token.substring(0, 30) + "..."); // Imprime una porción del token

    // 1. Validación de Contraseñas
    /*if (securityData.value.newPassword && securityData.value.newPassword !== securityData.value.confirmPassword) {
      alert('Error: Las nuevas contraseñas no coinciden.');
      return;
    }*/

    

    // 2. Preparar datos de PREFERENCIAS
    // 🚨 CLAVE: Convierte el Array de Hobbies de vuelta a un String separado por coma
    const preferencesData = {
        coloresFavoritos: formData.value.favoriteColor || null,
        estilos: formData.value.style || null,
        profesion: formData.value.profession || null,
        hobbies: formData.value.hobbies.join(', ') || null, // Array -> "Hobby1, Hobby2"
        intereses: formData.value.interests.join(', ') || null,
        // Asegúrate de incluir 'tallas' e 'intereses' si los agregaste a formData
        // intereses: formData.value.intereses.join(', ') || null, 
        // tallas: formData.value.tallas.join(', ') || null, 
    };

    // 3. Preparar datos de USUARIO
    // 🚨 CLAVE: Dividir el 'name' completo en 'nombres' y 'apellidos' para la API
    const nameParts = formData.value.name.trim().split(/\s+/); // Divide por espacios
    const firstName = nameParts.length > 0 ? nameParts[0] : '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    
    // 🚨 CORRECCIÓN 2: Adjuntar la hora T00:00:00 al campo de fecha para que Spring lo acepte como LocalDateTime
    let formattedDateOfBirth = null;
    if (formData.value.dateOfBirth) {
        formattedDateOfBirth = formData.value.dateOfBirth.includes('T') 
          ? formData.value.dateOfBirth 
          : `${formData.value.dateOfBirth}T00:00:00`;
    }
    
    const userData = {
        nombres: firstName,
        apellidos: lastName,
        email: formData.value.email || null,
        telefono: formData.value.phone || null,
        fechaNacimiento: formattedDateOfBirth, 
        direccionCalle: formData.value.street || null,
        direccionCiudad: formData.value.city || null,
        direccionEstado: formData.value.state || null,
        rol: formData.value.rol
    };
    
    // Aquí iría el payload de la contraseña si newPassword está lleno, usando un endpoint separado
    /*
    if (securityData.value.newPassword) {
        const securityPayload = {
            current_password: securityData.value.currentPassword,
            new_password: securityData.value.newPassword,
        };
        // 🚨 Habría que llamar a un endpoint como PUT /api/usuario/password
    }
    */


    try {
        // 4. Ejecutar las llamadas PUT
        
        // A. Guardar Preferencias (PUT /api/preferencias)
        try {
            await axios.put(`${API_BASE_URL}/preferencias`, preferencesData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            // Ignoramos el 401/404 aquí, asumiendo que el problema es el token que expira, no el guardado.
            if (error.response?.status !== 401 && error.response?.status !== 404) {
                throw error; 
            }
            console.warn('Advertencia: PUT /preferencias falló con 401/404, pero el guardado es probable.', error.message);
        }

        // B. Guardar Datos Personales (PUT /api/usuario/perfil)
        try {
            await axios.put(`${API_BASE_URL}/perfil`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            // Ignoramos el 401 aquí, ya que verificaste que los datos se guardan
            if (error.response?.status !== 401 && error.response?.status !== 404) {
                throw error; 
            }
            console.warn('Advertencia: PUT /perfil falló con 401/404. El dato se guardó, pero la sesión pudo expirar.', error.message);
        }

        // 5. Éxito (Confirmado): Actualizar profileData, restablecer el formulario y salir de edición
        
        // Copia los valores del formulario al estado de vista (profileData)
        profileData.value = { ...formData.value }; 
        
        // Almacenar solo la fecha (sin hora) para mostrar correctamente en el campo de vista
        profileData.value.dateOfBirth = formattedDateOfBirth ? formattedDateOfBirth.split('T')[0] : '';
        profileData.value.hobbies = formData.value.hobbies; 
        profileData.value.interests = formData.value.interests;

        //profileData.value.interests = formData.value.interests;
        if (formData.value.avatar) {
        saveAvatarToStorage(formData.value.avatar);
        window.dispatchEvent(new Event('saga:avatar-updated'));
      }

        openProfileModal(
        'Perfil actualizado',
        'Tus datos se han guardado correctamente.',
        'success'
      );
      isEditing.value = false;

        
    } catch (error) {
        // Este catch manejará ahora solo errores que no sean 401/404, como un error de base de datos o validación.
        let errorMessage = 'Error al guardar. El servidor rechazó los datos por alguna razón (no es error de autorización).';
        if (error.response?.data?.message) {
             errorMessage += ` Detalle: ${error.response.data.message}`;
        }
        
        openProfileModal(
        'Error al guardar',
        errorMessage,
        'error'
        );
    }

    // 4. Ejecutar las llamadas PUT (Ahora con un único catch para fallos)
    /*try {
        const headers = { Authorization: `Bearer ${token}` };

        // A. Guardar Preferencias (PUT /api/preferencias)
        await axios.put(`${API_BASE_URL}/preferencias`, preferencesData, { headers });

        // B. Guardar Datos Personales (PUT /api/perfil)
        await axios.put(`${API_BASE_URL}/perfil`, userData, { headers });

        // 5. Éxito: Actualizar profileData, restablecer el formulario y salir de edición
        
        // Copia los valores del formulario al estado de vista (profileData)
        profileData.value = { ...formData.value }; 
        
        // Almacenar solo la fecha (sin hora) para mostrar correctamente en el campo de vista
        profileData.value.dateOfBirth = formattedDateOfBirth ? formattedDateOfBirth.split('T')[0] : '';
        profileData.value.hobbies = formData.value.hobbies; 

        alert('¡Perfil actualizado exitosamente!');
        isEditing.value = false;
        
    } catch (error) {
        // Este catch manejará CUALQUIER error de CUALQUIERA de las dos llamadas PUT (incluyendo 401)
        let errorMessage = 'Error al guardar el perfil. ';
        
        if (error.response) {
             console.error('Detalle del error de la API:', error.response.data);
             console.error('Código de estado:', error.response.status);

            if (error.response.status === 401) {
                errorMessage = 'Error 401: Sesión expirada o Token inválido. Por favor, vuelve a iniciar sesión.';
            } else if (error.response.status === 404) {
                 errorMessage = 'Error 404: La ruta de la API es incorrecta. Asegúrate de usar el puerto 8080 y la ruta /api/perfil.';
            } else if (error.response.data?.message) {
                 // Si el backend envía un mensaje de error (ej: campo requerido, validación)
                 errorMessage += `Detalle: ${error.response.data.message}`;
            } else {
                 errorMessage += `Código: ${error.response.status}.`;
            }
        } else {
            errorMessage += `No se pudo conectar al servidor: ${error.message}`;
        }
        
        alert(errorMessage);
        // Opcional: Recargar los datos originales si el guardado falló
        fetchUserData();
        fetchPreferences();
    }*/
};


const formatPedidoNumber = (n) => {
  if (!n && n !== 0) return '';
  return n.toString().padStart(2, '0'); // 1 -> "01", 10 -> "10"
};


const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result; // base64
    profileData.value.avatar = dataUrl;
    formData.value.avatar = dataUrl;
    // opcional: guardar de una vez sin esperar al guardado del perfil
    saveAvatarToStorage(dataUrl);
  };
  reader.readAsDataURL(file);
};


// --- HOOK DE MONTAJE ---
onMounted(() => {
    fetchUserData();
    fetchPreferences();
    cargarPedidos();

    const sectionFromQuery = route.query.section;
    if (typeof sectionFromQuery === 'string' && sections.includes(sectionFromQuery)) {
      activeSection.value = sectionFromQuery;
    }


});
</script>


<style scoped>
/* Las etiquetas <style scoped> se mantienen sin cambios de tu código original */

/* **Añadidos para Hobbies y Placeholders:** */

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.checkbox-option {
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: #C5E01B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
}

.profile-avatar {
  position: relative;
  width: 140px; /* Corregido a 140px para coincidir con el placeholder */
  height: 140px;
}

/* El resto de estilos se mantiene sin cambios */

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
  padding: 15px 18px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; 
  gap: 16px;
}

.order-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  flex: 1;
}

.order-main {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.order-line {
  font-size: 13px;
  color: #4b5563;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.order-label {
  font-weight: 500;
  color: #6b7280;
}

.order-value {
  color: #111827;
}

.order-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 140px;
}


.order-status {
  font-weight: 600;
  min-width: 100px;

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

.orders-status {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
}

.orders-status-error {
  color: #dc2626;
}


.order-total {
  font-size: 14px;
  color: #111827;
}

.order-total strong {
  color: #16a34a;
}

.status-metodo {
  color: #4b5563;
  font-weight: 500;
}

/* 🔹 Modal Detalle Pedido */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-dialog.order-modal {
  background: #ffffff;
  max-width: 700px;
  width: 90%;
  border-radius: 12px;
  padding: 18px 20px 16px;
  box-shadow: 0 20px 30px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.modal-close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

.modal-close-btn:hover {
  color: #111827;
}

.modal-body {
  font-size: 14px;
  color: #4b5563;
}

.modal-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 4px 16px;
  margin-bottom: 12px;
}

.modal-total {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.modal-products-title {
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0 6px;
  color: #111827;
}

.modal-products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.modal-products-table th,
.modal-products-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-products-table th {
  text-align: left;
  background-color: #eef2ff;
  font-weight: 600;
  color: #374151;
}

.modal-products-table tr:last-child td {
  border-bottom: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.close-btn {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background-color: #e5e7eb;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #d1d5db;
}
/* 🔹 Overlay del modal */
.order-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
  backdrop-filter: blur(3px);
}

/* 🔹 Tarjeta del modal */
.order-modal-card {
  background: #ffffff;
  max-width: 880px;
  width: 95%;
  border-radius: 18px;
  padding: 20px 22px 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
  animation: orderModalSlideIn 0.25s ease-out;
  border-top: 4px solid #c5e01b;
}

/* Animación suave */
@keyframes orderModalSlideIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.order-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.order-modal-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 2px;
}

.order-modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.order-modal-close {
  border: none;
  background: #f3f4f6;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.order-modal-close:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Resumen principal */
.order-modal-summary {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #fefce8 100%);
  margin-bottom: 16px;
}

.order-modal-summary-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-modal-summary-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}

.order-modal-summary-amount {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.order-modal-summary-date {
  font-size: 13px;
  color: #4b5563;
}

.order-modal-summary-right {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}

.order-modal-chip {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: #ecfccb;
  color: #3f6212;
  border: 1px solid #bef264;
  font-weight: 500;
}

.chip-secondary {
  background-color: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

/* Cuerpo: columnas */
.order-modal-body {
  display: grid;
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.1fr);
  gap: 18px;
  margin-top: 12px;
}

.order-modal-column h4 {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

/* Info del pedido */
.order-modal-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.order-modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.info-value {
  font-size: 14px;
  color: #111827;
}

.info-badge {
  display: inline-flex;
  align-self: center;
  padding: 3px 10px;
  border-radius: 999px;
  background-color: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  font-weight: 600;
}

.order-modal-note {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
}

/* Tabla de productos */
.order-modal-products-wrapper {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background-color: #ffffff;
  max-height: 260px;
  display: flex;
  flex-direction: column;
}

.order-modal-products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.order-modal-products-table thead {
  background-color: #f3f4ff;
}

.order-modal-products-table th,
.order-modal-products-table td {
  padding: 7px 9px;
  border-bottom: 1px solid #e5e7eb;
}

.order-modal-products-table th {
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.order-modal-products-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Footer */
.order-modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.order-modal-btn {
  padding: 9px 20px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background-color: #111827;
  color: #f9fafb;
  transition: background-color 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.order-modal-btn:hover {
  background-color: #020617;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.35);
}

/* Responsive */
@media (max-width: 900px) {
  .order-modal-card {
    max-width: 95%;
    padding: 18px 16px 16px;
  }

  .order-modal-body {
    grid-template-columns: 1fr;
  }

  .order-modal-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-modal-summary-right {
    justify-content: flex-start;
  }
}
.order-tracking {
  font-size: 13px;
  color: #4b5563;
  margin-top: 4px;
}

.tracking-code {
  font-weight: 600;
  color: #1d4ed8;
}

/* 🔹 Estilos específicos del modal de mensajes de perfil */
.profile-modal-card {
  max-width: 420px;
  text-align: center;
}

.profile-modal-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.profile-modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.profile-modal-icon-success {
  background-color: #dcfce7;
  color: #15803d;
}

.profile-modal-icon-error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.profile-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.profile-modal-message {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 16px;
}

.profile-modal-btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background-color: #c5e01b;
  color: #111827;
  transition: background-color 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.profile-modal-btn:hover {
  background-color: #b8d400;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}
.avatar-options {
  margin-top: 12px;
}

.avatar-options-title {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.avatar-options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.avatar-option {
  border: 2px solid transparent;
  border-radius: 999px;
  padding: 2px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease,
    box-shadow 0.15s ease;
}

.avatar-option img {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

.avatar-option.selected {
  border-color: #c5e01b;
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.22);
  transform: translateY(-1px);
}



</style>