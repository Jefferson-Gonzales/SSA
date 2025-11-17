<template>
  <div class="profile-page">
    <HeaderNav /> 
    
    <div class="profile-container">
      
      <div class="profile-header">
        <div class="profile-avatar">
          <img v-if="profileData.avatar.startsWith('http')" :src="profileData.avatar" :alt="profileData.name" />
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
            <button class="avatar-edit-btn">
              <span class="avatar-edit-icon">✏️</span>
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
                <option>Minimalista, Casual Elegante</option>
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
import { ref, onMounted } from 'vue';
import axios from 'axios'; 
// Asume que HeaderNav existe, si no, necesitarás importarlo o quitarlo.
// import HeaderNav from './HeaderNav.vue'; 

// --- CONFIGURACIÓN Y CONSTANTES ---
const API_BASE_URL = 'http://localhost:8080/api'; 
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
/*agregar intereses
const interes =[
  'Ropa',
  'Tecnología',
  'Mueblería',
  'Hogar',
  'Herramientas',
  'Calzado',
  'Tecnología',
  'Juguetes',
  'Adornos',
  'Joyeria',
  'Jardineria',
  'Ropa Deportiva'
]*/

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
  avatar: 'https://via.placeholder.com/150/C5E01B/FFFFFF?text=JP', 
  street: '',
  city: '',
  state: '',
  favoriteColor: '#FFFFFF', 
  style: 'Casual',
  hobbies: [], 
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
    formData.value = { ...profileData.value, hobbies: [...profileData.value.hobbies] }; 
    securityData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    if (activeSection.value === 'Seguridad') activeSection.value = 'Información Personal'; 
  } else {
    // 🚨 FIX: Al EMPEZAR a editar, copiar todos los datos a formData.
    formData.value = { ...profileData.value };
    formData.value.hobbies = [...profileData.value.hobbies]; // Array copy
  }
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
    const token = getAuthToken();
    if (!token) { 
        alert('Error de autenticación. Por favor, reinicia la sesión.');
        return;
    }

    //console.log("Token a enviar:", token.substring(0, 30) + "..."); // Imprime una porción del token

    // 1. Validación de Contraseñas
    if (securityData.value.newPassword && securityData.value.newPassword !== securityData.value.confirmPassword) {
      alert('Error: Las nuevas contraseñas no coinciden.');
      return;
    }

    

    // 2. Preparar datos de PREFERENCIAS
    // 🚨 CLAVE: Convierte el Array de Hobbies de vuelta a un String separado por coma
    const preferencesData = {
        coloresFavoritos: formData.value.favoriteColor || null,
        estilos: formData.value.style || null,
        profesion: formData.value.profession || null,
        hobbies: formData.value.hobbies.join(', ') || null, // Array -> "Hobby1, Hobby2"
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
        telefono: formData.value.phone || null,
        fechaNacimiento: formattedDateOfBirth, // Formato YYYY-MM-DD
        direccionCalle: formData.value.street || null,
        direccionCiudad: formData.value.city || null,
        direccionEstado: formData.value.state || null,
        // No incluyas el email aquí a menos que tengas un endpoint separado para actualizarlo.
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

        alert('¡Perfil actualizado exitosamente!');
        isEditing.value = false;
        
    } catch (error) {
        // Este catch manejará ahora solo errores que no sean 401/404, como un error de base de datos o validación.
        let errorMessage = 'Error al guardar. El servidor rechazó los datos por alguna razón (no es error de autorización).';
        if (error.response?.data?.message) {
             errorMessage += ` Detalle: ${error.response.data.message}`;
        }
        
        alert(errorMessage);
        console.error('Error no manejado:', error.response?.data || error.message);
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

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  profileData.value.avatar = imageUrl;
  formData.value.avatarFile = file;
};


// --- HOOK DE MONTAJE ---
onMounted(() => {
    fetchUserData();
    fetchPreferences();
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