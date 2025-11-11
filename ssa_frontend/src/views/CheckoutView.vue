¡Mis más sinceras disculpas! Tienes razón, generé el código en la respuesta anterior pero no lo copié en el formato final, lo cual es frustrante.

Aquí está, por tercera vez y corregido, el código completo de la vista src/views/CheckoutView.vue con la lógica de Culqi y la integración con tu servicio de Axios que usa JWT:

Code snippet

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="main-container max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        Checkout y Pago con Culqi (Simulado)
      </h1>

      <div
        v-if="isLoading"
        id="loadingIndicator"
        class="text-center py-10"
      >
        <div
          class="animate-spin inline-block w-8 h-8 border-4 rounded-full border-lime-500 border-t-transparent"
        ></div>
        <p class="mt-2 text-gray-600">Procesando pago con Culqi...</p>
      </div>

      <div v-else id="checkoutContent" class="lg:flex lg:space-x-8">
        <div class="lg:w-3/5 bg-white p-8 rounded-xl shadow-lg h-fit">
          <h2
            class="text-2xl font-semibold text-gray-800 mb-6 flex items-center"
          >
            <i data-lucide="map-pin" class="w-6 h-6 text-lime-600 mr-3"></i>
            Información de Envío
          </h2>

          <form @submit.prevent="openCulqi">
            <div class="mb-6">
              <label
                for="direccionEnvio"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Dirección Completa de Envío</label
              >
              <textarea
                id="direccionEnvio"
                v-model="direccionEnvio"
                rows="3"
                required
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 transition duration-150 ease-in-out placeholder-gray-400"
                placeholder="Ej: Av. Primavera 742, Urb. El Sol, Lima - Perú."
              ></textarea>
              <p v-if="errorEnvio" class="mt-2 text-sm text-red-500">
                {{ errorEnvio }}
              </p>
            </div>

            <h3
              class="text-2xl font-semibold text-gray-800 mt-8 mb-6 border-t pt-4 flex items-center"
            >
              <i
                data-lucide="credit-card"
                class="w-6 h-6 text-lime-600 mr-3"
              ></i>
              Método de Pago
            </h3>
            <div
              class="p-4 border border-gray-300 bg-white rounded-xl space-y-2 text-center"
            >
              <p class="text-sm font-medium text-gray-600">
                Serás redirigido al formulario seguro de Culqi.
              </p>
              <p class="text-xs text-red-500 font-semibold">
                Usarás tarjetas de prueba de Culqi en el formulario emergente.
              </p>
            </div>

            <button
              type="submit"
              id="submitButton"
              :disabled="isLoading"
              class="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              Pagar y Confirmar Pedido S/{{ subtotal.toFixed(2) }}
            </button>
          </form>
        </div>

        <div
          class="mt-8 lg:mt-0 lg:w-2/5 bg-gray-100 p-8 rounded-xl shadow-inner h-fit"
        >
          <h2
            class="text-2xl font-semibold text-gray-800 mb-6 flex items-center"
          >
            <i data-lucide="receipt" class="w-6 h-6 text-lime-600 mr-3"></i>
            Resumen del Pedido
          </h2>
          <div id="productSummary" class="space-y-4 mb-6">
              <div class="flex justify-between items-center border-b pb-4">
                  <div class="flex items-center space-x-4">
                      <img src="https://placehold.co/60x60/333333/ffffff?text=Camiseta" alt="Camiseta" class="w-12 h-12 object-cover rounded-md">
                      <div>
                          <p class="text-sm font-medium text-gray-800">Camiseta clásica de algodón</p>
                          <p class="text-xs text-gray-500">Cantidad: 2 x S/25.00</p>
                      </div>
                  </div>
                  <p class="font-semibold text-gray-900">S/50.00</p>
              </div>
              <div class="flex justify-between items-center pb-4">
                  <div class="flex items-center space-x-4">
                      <img src="https://placehold.co/60x60/007FFF/ffffff?text=Zapatillas" alt="Zapatillas" class="w-12 h-12 object-cover rounded-md">
                      <div>
                          <p class="text-sm font-medium text-gray-800">Zapatillas cómodas para correr</p>
                          <p class="text-xs text-gray-500">Cantidad: 1 x S/30.00</p>
                      </div>
                  </div>
                  <p class="font-semibold text-gray-900">S/30.00</p>
              </div>
          </div>


          <div class="space-y-2 border-t pt-4">
            <div class="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>S/{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Envío:</span>
              <span class="text-lime-600 font-medium">Gratis</span>
            </div>
            <div
              class="flex justify-between text-xl font-bold text-gray-900 border-t pt-3"
            >
              <span>Total a Pagar:</span>
              <span>S/{{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="modal.show"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300"
        :class="{ 'scale-100 opacity-100': modal.show, 'scale-95 opacity-0': !modal.show }"
      >
        <div class="text-center">
          <div
            :class="[
              modal.success ? 'bg-lime-100' : 'bg-red-100',
              'mx-auto flex items-center justify-center h-12 w-12 rounded-full',
            ]"
          >
            <i
              :data-lucide="modal.success ? 'check-circle' : 'x-circle'"
              :class="['w-6 h-6', modal.success ? 'text-lime-600' : 'text-red-600']"
            ></i>
          </div>
          <h3
            class="mt-4 text-lg leading-6 font-medium text-gray-900"
            v-text="modal.title"
          ></h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500" v-text="modal.message"></p>
            <p
              class="mt-3 text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded-lg text-left break-all whitespace-pre-wrap"
              v-text="modal.details"
            ></p>
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button
            type="button"
            @click="closeModal"
            class="inline-flex justify-center w-full rounded-lg border border-transparent shadow-sm px-4 py-2 bg-lime-600 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 sm:text-sm"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue';
// IMPORTACIÓN: Usamos la función nombrada que está en api.js
import { createPedido } from '@/services/api'; 
//import 'lucide/dist/lucide'; 

// Culqi global, se asume que se carga desde el index.html
const Culqi = window.Culqi; 
let culqiCallbackRef = null; 

// Función global que Culqi llama al terminar el proceso en el modal
function culqi() {
  if (culqiCallbackRef) {
    culqiCallbackRef();
  }
}
window.culqi = culqi; 

export default {
  name: 'CheckoutView',
  setup() {
    // --- Configuración / Estado ---
    // Usar la llave de prueba de Culqi
    const CULQI_PUBLIC_KEY = 'pk_test_e735492t1g0e4709'; 
    const direccionEnvio = ref('');
    const isLoading = ref(false);
    const errorEnvio = ref(null);
    
    // Simulación de los datos del carrito (Ajusta esto a tu lógica real de carrito)
    const cartItems = [
      { idProducto: 15, cantidad: 2, precio: 25.0 },
      { idProducto: 16, cantidad: 1, precio: 30.0 },
    ];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.cantidad * item.precio,
      0
    );
    // Culqi requiere el monto en céntimos (ej. 80.00 soles -> 8000)
    const totalPedidoCents = Math.round(subtotal * 100); 

    const modal = ref({
      show: false,
      success: false,
      title: '',
      message: '',
      details: '',
    });

    // --- Métodos de Interfaz y Lógica ---

    const closeModal = () => {
      modal.value.show = false;
      // Aquí puedes redirigir al home o a otra página
      // router.push('/') 
    };

    const displayMessage = (success, title, message, details) => {
      modal.value = { show: true, success, title, message, details };
      nextTick(() => {
        // Renderizar íconos de Lucide
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });
    };

    /**
     * Lógica que se ejecuta después de que Culqi genera el token.
     * Esto llama a tu API de Spring Boot con el token y el JWT de autenticación.
     */
    const handleCulqiResponse = async () => {
      isLoading.value = true;
      const submitButton = document.getElementById('submitButton');
      submitButton.disabled = true;

      try {
        if (Culqi.token) {
          const culqiToken = Culqi.token.id;
          
          // 1. Construir el DtoPedido para el Backend
          const pedidoData = {
            direccionEnvio: direccionEnvio.value,
            total: subtotal,
            culqiToken: culqiToken, // Si tu backend lo necesita para procesar el cargo
            detalles: cartItems.map((item) => ({
              idProducto: item.idProducto,
              cantidad: item.cantidad,
            })),
          };

          // 2. Enviar el Pedido al Backend usando el servicio (Axios con JWT)
          const responseBody = await createPedido(pedidoData);

          // Éxito: Pedido creado en tu base de datos MySQL
          // El backend debe retornar el objeto de Pedido creado
          const pedidoId = responseBody.idpedido || responseBody.id || 'N/A';

          displayMessage(
            true,
            '¡Pago Procesado y Pedido Creado!',
            `El pago con Culqi fue exitoso. Token generado: ${culqiToken}. Pedido N°: ${pedidoId}.`,
            `ID Pedido: ${pedidoId}\nTotal: S/${subtotal.toFixed(2)}\nToken Culqi: ${culqiToken}`
          );
        } else if (Culqi.error) {
          // Error en el modal de Culqi (ej. tarjeta de prueba inválida o cancelada)
          const error = Culqi.error;
          if (error.user_message !== 'El usuario canceló la operación.') {
            displayMessage(
              false,
              'Fallo en la Tarjeta',
              error.user_message || 'Error desconocido de Culqi.',
              `Código de Error: ${error.code}`
            );
          }
        }
      } catch (error) {
        // Error capturado por el servicio API (fallo de conexión, 401, 500, etc.)
        console.error('Error completo en el checkout:', error);
        
        // Intentar parsear el error generado en api.js: [STATUS_CODE] Message
        let match = error.message.match(/\[(\d+)\] (.*)/);
        let statusCode = match ? match[1] : '500';
        let errorMsg = match ? match[2] : error.message;

        let friendlyTitle = 'Fallo al Crear Pedido';
        if (statusCode === '401' || statusCode === '403') {
             friendlyTitle = 'Sesión Expirada/No Autorizada (Verifica tu JWT)';
        } else if (statusCode === '404') {
             friendlyTitle = 'Endpoint No Encontrado (Verifica la URL en tu Spring Boot)';
        }

        displayMessage(
            false, 
            friendlyTitle, 
            errorMsg, 
            `Estado HTTP: ${statusCode}`
        );
      } finally {
        isLoading.value = false;
        submitButton.disabled = false;
      }
    };
    
    // Asignar la función para que Culqi la pueda ejecutar globalmente
    culqiCallbackRef = handleCulqiResponse; 

    /**
     * Valida el formulario de envío y abre el modal de Culqi.
     */
    const openCulqi = () => {
      errorEnvio.value = null;
      if (!direccionEnvio.value.trim()) {
        errorEnvio.value = 'Debes ingresar una dirección de envío.';
        return;
      }

      if (typeof Culqi === 'undefined') {
        displayMessage(false, 'Error Crítico', 'La librería Culqi.js no se ha cargado.', 'Asegúrate de incluir la etiqueta script de Culqi en tu index.html.');
        return;
      }

      // Configuración obligatoria para Culqi
      Culqi.settings({
        title: 'SagasMart',
        currency: 'PEN',
        description: 'Compra de productos varios',
        amount: totalPedidoCents, // Monto en céntimos
        order_id: `ord_${Date.now()}`, 
        options: {
          jsonRequest: true,
        },
      });

      // Abrir el modal de pago
      Culqi.open();
    };


    // --- Ciclo de Vida ---
    onMounted(() => {
      // 1. Inicializar Culqi con la llave pública
      if (typeof Culqi !== 'undefined') {
        Culqi.publicKey = CULQI_PUBLIC_KEY;
      }

      // 2. Renderizar los íconos de Lucide
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });

    return {
      direccionEnvio,
      subtotal,
      isLoading,
      modal,
      errorEnvio,
      openCulqi,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* Estilos opcionales */
.main-container {
  min-height: calc(100vh - 64px); /* Ajusta si tienes un header */
}
</style>
