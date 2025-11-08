<template>
  <div class="personalization-container">
    <div class="personalization-card">
      <div class="personalization-header">
        <h1>Personaliza tu Experiencia</h1>
        <p>Cuéntanos más sobre ti para recomendaciones personalizadas</p>
      </div>

      <div class="progress-container">
        <div class="progress-bar" :style="{ width: (currentStep / totalSteps) * 100 + '%' }"></div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="currentStep === 1" class="form-step">
          <h2>¿Cuál es tu profesión?</h2>
          <div class="checkbox-group">
            <label class="checkbox-item" v-for="profession in professions" :key="profession">
              <input 
                type="checkbox" 
                v-model="formData.professions" 
                :value="profession"
              >
              <span>{{ profession }}</span>
            </label>
          </div>
        </div>

        <div v-if="currentStep === 2" class="form-step">
          <h2>¿Cuáles son tus Hobbies?</h2>
          <div class="checkbox-group">
            <label class="checkbox-item" v-for="hobby in hobbies" :key="hobby">
              <input 
                type="checkbox" 
                v-model="formData.hobbies" 
                :value="hobby"
              >
              <span>{{ hobby }}</span>
            </label>
          </div>
        </div>

        <div v-if="currentStep === 3" class="form-step">
          <h2>¿Cuál es tu Color Favorito?</h2>
          <div class="color-grid">
            <label class="color-option" v-for="color in colors" :key="color.name">
              <input 
                type="radio" 
                v-model="formData.favoriteColor" 
                :value="color.name"
                hidden
              >
              <div 
                class="color-box" 
                :style="{ backgroundColor: color.value }"
                :class="{ selected: formData.favoriteColor === color.name }"
              ></div>
              <span>{{ color.name }}</span>
            </label>
          </div>
        </div>

        <div v-if="currentStep === 4" class="form-step">
          <h2>¿Cuál es tu Estilo Preferido?</h2>
          <div class="checkbox-group">
            <label class="checkbox-item" v-for="style in styles" :key="style">
              <input 
                type="checkbox" 
                v-model="formData.styles" 
                :value="style"
              >
              <span>{{ style }}</span>
            </label>
          </div>
        </div>

        <div v-if="currentStep === 5" class="form-step">
          <h2>¿Qué te Interesa Comprar?</h2>
          <div class="checkbox-group">
            <label class="checkbox-item" v-for="interest in interests" :key="interest">
              <input 
                type="checkbox" 
                v-model="formData.interests" 
                :value="interest"
              >
              <span>{{ interest }}</span>
            </label>
          </div>
        </div>

        <div class="button-container">
          <button 
            v-if="currentStep > 1" 
            type="button" 
            class="btn btn-secondary"
            @click="previousStep"
          >
            Atrás
          </button>
          <button 
            v-if="currentStep < totalSteps" 
            type="button" 
            class="btn btn-primary"
            @click="nextStep"
          >
            Siguiente
          </button>
          <button 
            v-if="currentStep === totalSteps" 
            type="submit" 
            class="btn btn-primary"
          >
            Completar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const totalSteps = 5

const professions = [
  'Estudiante',
  'Profesional de TI',
  'Educador',
  'Emprendedor',
  'Empleado Corporativo',
  'Otro'
]

const hobbies = [
  'Deportes',
  'Viajes',
  'Lectura',
  'Música',
  'Cine',
  'Fotografía',
  'Cocina',
  'Gimnasio'
]

const colors = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Azul', value: '#0066CC' },
  { name: 'Verde', value: '#00AA44' },
  { name: 'Rojo', value: '#CC0000' },
  { name: 'Gris', value: '#666666' },
  { name: 'Rosa', value: '#FF69B4' },
  { name: 'Naranja', value: '#FF9900' }
]

const styles = [
  'Casual',
  'Deportivo',
  'Formal',
  'Bohemio',
  'Minimalista',
  'Clásico',
  'Moderno'
]

const interests = [
  'Ropa',
  'Zapatos',
  'Accesorios',
  'Deportes',
  'Tecnología',
  'Hogar',
  'Belleza'
]

const formData = ref({
  professions: [],
  hobbies: [],
  favoriteColor: '',
  styles: [],
  interests: []
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = () => {
  console.log('Personalization Data:', formData.value)
  alert('¡Tus preferencias han sido guardadas!')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.personalization-container {
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.personalization-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 60px;
  max-width: 600px;
  width: 100%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.personalization-header {
  text-align: center;
  margin-bottom: 40px;
}

.personalization-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.personalization-header p {
  font-size: 16px;
  color: #666;
}

.progress-container {
  margin-bottom: 40px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #C5E01B;
  transition: width 0.3s ease;
}

.form-step {
  animation: fadeIn 0.3s ease-out;
  margin-bottom: 40px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.form-step h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 25px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-item input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #C5E01B;
}

.checkbox-item:hover {
  border-color: #C5E01B;
  background: rgba(197, 224, 27, 0.05);
}

.checkbox-item input[type="checkbox"]:checked ~ span {
  color: #C5E01B;
  font-weight: 600;
}

.checkbox-item span {
  font-size: 14px;
  color: #333;
  transition: color 0.2s ease;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.color-box {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.color-box.selected {
  border-color: #C5E01B;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(197, 224, 27, 0.2);
}

.color-option span {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  margin-top: 40px;
}

.btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-primary {
  background: #C5E01B;
  color: #1a1a1a;
}

.btn-primary:hover {
  background: #b8d01a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(197, 224, 27, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #f0f0f0;
  color: #1a1a1a;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e5e5e5;
  border-color: #d0d0d0;
}

@media (max-width: 768px) {
  .personalization-card {
    padding: 40px 25px;
  }

  .personalization-header h1 {
    font-size: 24px;
  }

  .checkbox-group {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .color-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  .button-container {
    flex-direction: column;
  }

  .btn {
    flex: 1;
  }
}
</style>