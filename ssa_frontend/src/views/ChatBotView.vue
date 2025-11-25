<template>
  <div class="chat-wrapper" role="dialog" aria-label="Asistente de compras">
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-content">
          <img width="45" height="45" src="../assets/ic_bot.png" alt="chatbot"/>
          <div class="header-info">
            <h3 class="header-title">Asistente de compras</h3>
            <span class="status-badge">Online</span>
          </div>
        </div>
        <button type="button" class="close-btn" @click="closeChat" aria-label="Cerrar chat">×</button>
      </div>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <!-- Loop through messages -->
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message-group', message.type]"
        >
          <!-- Assistant messages -->
          <template v-if="message.type === 'assistant'">
            <img width="48" height="48" src="../assets/ic_bot.png" alt="Assistant" class="message-avatar">
            <div class="message-bubble assistant-message">
              <p>{{ message.text }}</p>
            </div>
          </template>

          <!-- User messages -->
          <template v-else>
            <div class="message-bubble user-message">
              <p>{{ message.text }}</p>
            </div>
            <img width="100" height="100" src="https://img.icons8.com/stickers/100/user-male-circle.png" alt="User" class="message-avatar">
          </template>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message-group assistant">
          <img width="48" height="48" src="../assets/ic_bot.png" alt="Assistant" class="message-avatar">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          class="message-input"
          v-model="messageText"
          @keyup.enter="sendMessage"
          :disabled="isTyping"
          aria-label="Escribe tu mensaje"
        />
        <button 
          type="button" 
          class="audio-btn" 
          @click="startAudio" 
          aria-label="Enviar audio" 
          style="margin-right: 8px;"
          :disabled="isTyping"
        >
          <img width="27" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC5klEQVR4nO2Yz2oUQRDGZw0aNNGTD2BU9OBR1yTmsEZBPYh3xaDgUVHQg+ApiEhACSqJUcEnEFHIQZIoBPQVdPUQMIp/MCCYSGQDm58U1Cxlu87OLD2b2TUfNAPVXVXf113du91BsIoWA3AAuA8UgZ/aimrrD7IKYCvwgtp4LmODLAHoBeaIDxnbG2QBwDaHfAkYAbqBDm0icBRYckR0ZUGALZsvwO6IsXkdE2KysWyrb1g783ti+OSdldjfGLbVyTwwREYS+N01fvfSZRlN5K0h0p3AT/ZEiGK6LKOJLBginQn8Nhq/hXRZRhOpoA7fGXWdSYdd+gK2A5fkmw67lAVkAvzPK0AL7IEK0mEXj8SiclhsVgEXgHfyzbQA4DrwS74eY1YVkEauQP+oCUoNEFDynSsqWRuwS74eY1bgg3utZONqHm9WAWU1lz3GnFfzvA/uqc1WRMwTwCv5+uAe+bfZzNYf9hjxNhm/H96IRiSUsz7EDmOX9556LjT7jN+bKn3HgJxPAdMm4RFjl8eqEKMJ4o0ZvzFj7wOW1X7Wp4Bhk/C2sffXcanf61zqC/+4Y1/zKaBgAr+3576+tIWQJ5N8DfJfzfgJ07cO+FZPScYR0OY8Xp0yfV1O35K+Okgtd2rr07KxMy9kt5g450zfrNc9oAmuOAk6TF9PwqdFId9j/Dc7K3PeK3lNsh74aJI8trOkKzEZg/yEM/NrgGdOibZ7F6DJjjtkbrhLLS9t8lglx6P+fkh7rSVUqFKaD028sj3l0hJx0xHxyJZTgjhSNk+cWFfTYf33rD11En8ATks5xPBvB844NY+uWk1/nyLclQjr9w5wGNhpntdlfxwFbgGfHZ9lYMj7qZNgT3yifswChxpO3BGxQY/YuYTELyb5A9iosipoaU07gr4DL/W+exBYG2QdwKARMBg0G1gV0CDI8QecBC47bcoImKrSLz65LAgYoH4MrDT/lhCQ03IYStiyUUIrjd+bjgyI3NkBgwAAAABJRU5ErkJggg==" alt="microphone">
        </button>
        <button 
          type="button" 
          class="send-btn" 
          @click="sendMessage" 
          :disabled="isTyping"
          aria-label="Enviar mensaje"
        >
          <span class="arrow">➤</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const LOCAL_STORAGE_CART_KEY = 'SAGA_SHOPPING_CART';
const TRACKING_STORAGE_KEY = 'SAGA_TRACKING_HISTORY';


export default {
  name: 'ChatBot',
  emits: ['close-chat'],
  data() {
    return { 
      messageText: '',
      messages: [],
      isTyping : false,
      apiUrl: 'http://localhost:8080/api/chatbot',
      storageKey: 'chat_history_guest',

      inactivityTimeoutId: null,
      inactivityMessageSent: false,
      inactivityMessageText: 'Ante cualquier duda, escríbeme; estaré aquí para ayudarte. ¡Gracias.',

      recognition: null,
      isListening: false,

      // 🔹 NUEVO: flujo de compra guiado
      checkoutState: 'IDLE', // 'IDLE' | 'PIDE_DIRECCION' | 'PIDE_DNI' | 'PIDE_METODO' | 'RESUMEN'
      checkoutData: {
      direccionEnvio: null,
      dni: null,
      metodoPago: null,
      },

    }
  },

  created() {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const userObj = JSON.parse(rawUser);
        const userId = userObj.id || userObj.email || 'guest';
        this.storageKey = `chat_history_${userId}`;
      } else {
        this.storageKey = 'chat_history_guest';
      }
    } catch (e) {
      console.error('Error leyendo usuario de localStorage:', e);
      this.storageKey = 'chat_history_guest';
    }
  },

  mounted() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.messages = JSON.parse(saved);
      } catch (e) {
        console.error('Error parseando historial del chat:', e);
        this.messages = [];
      }
    }

    if (this.messages.length === 0) {
      this.messages.push({
        type: 'assistant',
        text: 'Hola, soy tu asistente de compras. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      });
    }

    this.$nextTick(() => {
      this.scrollToBottom();
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-PE';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event);
        this.isListening = false;
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ')
          .trim();

        if (transcript) {
          this.messageText = transcript;
          this.sendMessage();
        }
      };
    } else {
      console.warn('Reconocimiento de voz no soportado en este navegador');
    }
  },

  watch: {
    messages: {
      deep: true,
      handler(newVal) {
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(newVal));
        } catch (e) {
          console.error('Error guardando historial del chat:', e);
        }
        this.resetInactivityTimer();
      }
    }
  },

  methods: {
    closeChat() {
      this.$emit('close-chat');
    },

   // =========================
    // SEGUIMIENTO DE VARIOS PEDIDOS
    // =========================
    loadTrackingHistory() {
      try {
        const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);

        // Si es un solo objeto, lo envolvemos en array
        if (!Array.isArray(parsed)) {
          return [parsed];
        }
        return parsed;
      } catch (e) {
        console.error('Error leyendo tracking simulado:', e);
        return [];
      }
    },

    getSimulatedPhaseLabel(tracking) {
      if (!tracking || !tracking.createdAt) {
        return 'Estado no disponible (falta información de fecha).';
      }

      const now = Date.now();
      const diffMs = now - tracking.createdAt;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 2) {
        return 'Procesando tu pedido (confirmando pago y registrando la orden).';
      } else if (diffHours < 24) {
        return 'Preparando tu pedido para el envío.';
      } else if (diffHours < 72) {
        return 'En camino hacia tu dirección.';
      } else {
        return 'Entregado (estado simulado para fines de demostración).';
      }
    },

    getTrackingStatusMessage(tracking) {
      if (!tracking) {
        return 'No encuentro ningún pedido con ese número para hacer seguimiento. Asegúrate de haber completado una compra en esta tienda.';
      }

      const fechaPedido = tracking.createdAt
        ? new Date(tracking.createdAt).toLocaleString('es-PE')
        : 'No disponible';

      const estado = this.getSimulatedPhaseLabel(tracking);

      return (
        `Aquí tienes el seguimiento simulado de tu pedido:\n` +
        `• Número de pedido: ${tracking.numeroPedidoCliente}\n` +
        `• Código de seguimiento: ${tracking.trackingCode || 'No asignado'}\n` +
        `• Estado actual: ${estado}\n` +
        `• Fecha de generación del pedido: ${fechaPedido}\n\n`
      );
    },

    extractOrderNumberFromText(text) {
      const t = (text || '').toLowerCase();

      // Ejemplos que detecta:
      // "pedido 9", "pedido #09", "pedido nro 10", "pedido número 11"
      const regex = /(pedido|orden|nro\.?|numero|número|#)\s*([0-9]+)/i;
      const match = t.match(regex);

      if (match && match[2]) {
        return match[2].replace(/^0+/, '') || match[2]; // quita ceros a la izquierda
      }

      // Como fallback, tomamos el último número que aparezca en el texto
      const anyNumber = t.match(/([0-9]+)/g);
      if (anyNumber && anyNumber.length) {
        const last = anyNumber[anyNumber.length - 1];
        return last.replace(/^0+/, '') || last;
      }

      return null;
    },

    findTrackingEntry(history, orderNumber) {
      if (!orderNumber) return null;
      const clean = String(orderNumber).replace(/^0+/, '');

      // Buscamos por numeroPedidoCliente
      let found = history.find(t => {
        if (!t.numeroPedidoCliente) return false;
        const num = String(t.numeroPedidoCliente).replace(/^0+/, '');
        return num === clean;
      });

      if (found) return found;

      // Ojo: si en tu backend guardas el número también dentro del trackingCode,
      // podrías tratar de matchear ahí:
      found = history.find(t => {
        if (!t.trackingCode) return false;
        return t.trackingCode.includes(clean);
      });

      return found || null;
    },

    async tryHandleTrackingCommand(text) {
      const lower = (text || '').toLowerCase();

      const isTrackingIntent =
        lower.includes('seguimiento') ||
        lower.includes('estado de mi pedido') ||
        lower.includes('estado del pedido') ||
        lower.includes('dónde está mi pedido') ||
        lower.includes('donde esta mi pedido') ||
        lower.includes('rastrear mi pedido') ||
        lower.includes('rastrear pedido') ||
        lower.includes('mi pedido') ||
        lower.includes('mi orden');

      if (!isTrackingIntent) return false;

      const history = this.loadTrackingHistory();

      if (!history || history.length === 0) {
        this.messages.push({
          type: 'assistant',
          text: 'No tengo pedidos registrados para hacer seguimiento en este dispositivo. Asegúrate de haber completado una compra recientemente.',
          timestamp: new Date()
        });
        return true;
      }

      // 1) Intentar extraer número explícito del mensaje
      const numeroPedido = this.extractOrderNumberFromText(text);

      if (numeroPedido) {
        const tracking = this.findTrackingEntry(history, numeroPedido);

        if (!tracking) {
          const lista = history
            .map(t => `• Pedido ${t.numeroPedidoCliente} – código: ${t.trackingCode || 'N/D'}`)
            .join('\n');

          this.messages.push({
            type: 'assistant',
            text:
              `No encuentro ningún pedido con el número ${numeroPedido} en este dispositivo.\n\n` +
              `Estos son los pedidos que tengo registrados:\n${lista}\n\n` +
              `Dime por ejemplo: "seguimiento del pedido 09".`,
            timestamp: new Date()
          });
          return true;
        }

        const msg = this.getTrackingStatusMessage(tracking);
        this.messages.push({
          type: 'assistant',
          text: msg,
          timestamp: new Date()
        });
        return true;
      }

      // 2) Si NO especificó número
      if (history.length === 1) {
        const msg = this.getTrackingStatusMessage(history[0]);
        this.messages.push({
          type: 'assistant',
          text: msg,
          timestamp: new Date()
        });
        return true;
      }

      // 3) Varios pedidos y no especificó cuál
      const resumen = history
        .map(t => {
          const estado = this.getSimulatedPhaseLabel(t);
          return `• Pedido ${t.numeroPedidoCliente} – ${estado}`;
        })
        .join('\n');

      this.messages.push({
        type: 'assistant',
        text:
          `Tengo registrados varios pedidos en este dispositivo:\n\n${resumen}\n\n` +
          `Por favor dime cuál quieres consultar. Por ejemplo: "seguimiento del pedido 09".`,
        timestamp: new Date()
      });

      return true;
    },


    // =========================
    // INACTIVIDAD
    // =========================
    isFarewell(text) {
      const t = (text || '').trim().toLowerCase();
      return (
        t.includes('gracias') ||
        t.includes('muchas gracias') ||
        t.includes('chau') ||
        t.includes('chao') ||
        t.includes('adios') ||
        t.includes('adiós') ||
        t.includes('nos vemos') ||
        t.includes('hasta luego')
      );
    },


    shouldStartCheckout(text) {
      const t = (text || '').toLowerCase();
      return (
        t.includes('comprar') ||
        t.includes('quiero pagar') ||
        t.includes('proceder al pago') ||
        t.includes('finalizar pedido') ||
        t.includes('hacer pedido') ||
        t.includes('comprar lo del carrito') ||
        t.includes('comprar lo que tengo en el carrito')
      );
    },



    startCheckoutFlow() {
      const items = this.loadCart();

      if (!items.length) {
        this.messages.push({
          type: 'assistant',
          text: 'Tu carrito está vacío. Agrega algunos productos y luego te ayudo a completar la compra.',
          timestamp: new Date()
        });
        return;
      }

      const total = this.getCartTotal();
      const resumen = items
        .map(i => `- ${i.quantity}x ${i.name} – S/.${(i.price * i.quantity).toFixed(2)}`)
        .join('\n');

      this.checkoutState = 'PIDE_DIRECCION';

      this.messages.push({
        type: 'assistant',
        text:
          `Este es el resumen de tu carrito:\n${resumen}\nTotal: S/.${total.toFixed(2)}\n\n` +
          `Te voy a guiar para completar tu compra.\n` +
          `Primero, dime tu *dirección de envío* completa.`,
        timestamp: new Date()
      });
   },

   handleCheckoutFlowStep(userText) {
  switch (this.checkoutState) {
    case 'PIDE_DIRECCION': {
      this.checkoutData.direccionEnvio = userText;
      this.checkoutState = 'PIDE_DNI';
      this.messages.push({
        type: 'assistant',
        text: 'Gracias. Ahora indícame tu *DNI* para el comprobante.',
        timestamp: new Date()
      });
      break;
    }

    case 'PIDE_DNI': {
      this.checkoutData.dni = userText;
      this.checkoutState = 'PIDE_METODO';
      this.messages.push({
        type: 'assistant',
        text: '¿Con qué método deseas pagar? Por ahora tengo: *tarjeta* (Stripe).',
        timestamp: new Date()
      });
      break;
    }

    case 'PIDE_METODO': {
      if (/tarjeta/i.test(userText)) {
        this.checkoutData.metodoPago = 'TARJETA_STRIPE';
      } else {
        // Por ahora siempre mandamos a tarjeta
        this.checkoutData.metodoPago = 'TARJETA_STRIPE';
      }

      const total = this.getCartTotal();
      this.checkoutState = 'RESUMEN';

      this.messages.push({
        type: 'assistant',
        text:
          `Perfecto, este es el resumen de tu pedido:\n` +
          `Total: S/.${total.toFixed(2)}\n` +
          `Dirección: ${this.checkoutData.direccionEnvio}\n` +
          `DNI: ${this.checkoutData.dni}\n` +
          `Método de pago: Tarjeta (Stripe)\n\n` +
          `¿Confirmas que deseas proceder al pago? (responde "sí" o "no")`,
        timestamp: new Date()
      });
      break;
    }

    case 'RESUMEN': {
      if (/^s[ií]/i.test(userText)) {
        this.messages.push({
          type: 'assistant',
          text: 'Perfecto, te llevaré a la pantalla de pago para que completes tu compra.',
          timestamp: new Date()
        });

        // 👉 Redirigir al carrito con query params
        this.$router.push({
          path: '/carrito',
          query: {
            checkout: 'true',
            dni: this.checkoutData.dni,
            direccion: this.checkoutData.direccionEnvio,
            metodoPago: this.checkoutData.metodoPago,
          },
        });

      } else {
        this.messages.push({
          type: 'assistant',
          text: 'De acuerdo, he cancelado el proceso de compra. Si quieres intentarlo de nuevo, solo dímelo.',
          timestamp: new Date()
        });
      }

      // Siempre reseteamos el flujo al final
      this.checkoutState = 'IDLE';
      this.checkoutData = { direccionEnvio: null, dni: null, metodoPago: null };
      break;
    }
  }
},

    resetInactivityTimer() {
      if (this.inactivityTimeoutId) {
        clearTimeout(this.inactivityTimeoutId);
      }
      // 👇 YA NO reseteamos inactivityMessageSent aquí
      this.inactivityTimeoutId = setTimeout(() => {
        this.handleInactivity();
      }, 2 * 60 * 1000);
    },

    handleInactivity() {
      if (this.inactivityMessageSent) return;

      this.messages.push({
        type: 'assistant',
        text: this.inactivityMessageText,
        timestamp: new Date()
      });

      this.inactivityMessageSent = true;

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    // =========================
    // CARRITO
    // =========================
    loadCart() {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Error al cargar el carrito:', e);
        return [];
      }
    },

    saveCart(cart) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Error al guardar el carrito:', e);
      }
    },

    getCartTotal() {
      const items = this.loadCart();
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },


    addToCartFromProduct(product, quantity = 1) {
      const cart = this.loadCart();
      const id = product.idproducto;

      if (!id) {
        console.error('El producto no tiene idproducto:', product);
        return;
      }

      const index = cart.findIndex(item => item.id === id);

      if (index !== -1) {
        cart[index].quantity += quantity;
      } else {
        cart.push({
          id,
          name: product.nombre,
          price: parseFloat(product.precioBase),
          quantity,
          image: product.imagenUrl || 'https://placehold.jp/250x250/e8e8e8/777777?text=SAGASMART',
          size: 'N/A'
        });
      }

      this.saveCart(cart);
    },

    normalizeText(text) {
      return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/["“”']/g, '')
        .trim();
    },

    buildProductSearchTerm(rawName) {
      const cleaned = this.normalizeText(rawName);

      const stopwords = [
        'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
        'mi', 'mis', 'tu', 'tus', 'su', 'sus',
        'de', 'del', 'al', 'para', 'por', 'en', 'a',
        'carrito', 'carro', 'cesta', 'bolsa'
      ];

      const tokens = cleaned
        .split(/\s+/)
        .filter(t => t && !stopwords.includes(t));

      if (tokens.length === 0) return cleaned;

      return tokens.join(' ');
    },

    addBestMatchingProductToCart(rawName, products) {
      const target = this.normalizeText(rawName);
      const targetTokens = target.split(/\s+/).filter(Boolean);

      let best = null;
      let bestScore = -1;

      for (const p of products) {
        const name = this.normalizeText(p.nombre || '');
        let score = 0;

        if (name.includes(target)) score += 3;

        for (const tk of targetTokens) {
          if (tk.length >= 3 && name.includes(tk)) {
            score += 1;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          best = p;
        }
      }

      const chosen = best || products[0];

      this.addToCartFromProduct(chosen, 1);

      this.messages.push({
        type: 'assistant',
        text: `Listo, añadí "${chosen.nombre}" a tu carrito.`,
        timestamp: new Date()
      });
    },

    async tryHandleCartCommand(text) {
      const lower = text.toLowerCase();

      const isCartCommand =
        lower.includes('agrega') ||
        lower.includes('añade') ||
        lower.includes('añadir') ||
        lower.includes('pon') ||
        lower.includes('poner') ||
        lower.includes('mete') ||
        lower.includes('añadir al carrito') ||
        lower.includes('al carrito') ||
        lower.includes('a mi carrito');

      if (!isCartCommand) return false;

      let rawName = '';

      const quotedMatch = text.match(/"(.*?)"/);
      if (quotedMatch && quotedMatch[1]) {
        rawName = quotedMatch[1];
      } else {
        const verbRegex = /(agrega|agregar|añade|añadir|pon|poner|mete)\s+(.*)/i;
        const verbMatch = text.match(verbRegex);
        if (verbMatch && verbMatch[2]) {
          rawName = verbMatch[2];
          rawName = rawName.replace(/a mi carrito.*$/i, '');
          rawName = rawName.replace(/al carrito.*$/i, '');
          rawName = rawName.replace(/al carro.*$/i, '');
          rawName = rawName.replace(/a la cesta.*$/i, '');
        }
      }

      rawName = rawName.trim();
      if (!rawName) {
        this.messages.push({
          type: 'assistant',
          text: '¿Qué producto quieres que agregue al carrito?',
          timestamp: new Date()
        });
        return true;
      }

      const searchTerm = this.buildProductSearchTerm(rawName);
      console.log('🔍 Nombre bruto:', rawName);
      console.log('🔍 Término de búsqueda limpio:', searchTerm);

      try {
        const { data } = await axios.get('http://localhost:8080/api/productos/buscar', {
          params: { query: searchTerm, limit: 10 }
        });

        if (!data || data.length === 0) {
          if (searchTerm !== rawName.toLowerCase()) {
            const { data: dataRaw } = await axios.get('http://localhost:8080/api/productos/buscar', {
              params: { query: rawName, limit: 10 }
            });

            if (!dataRaw || dataRaw.length === 0) {
              this.messages.push({
                type: 'assistant',
                text: `He buscado "${rawName}", pero ahora mismo no encuentro un producto que coincida para agregar al carrito.`,
                timestamp: new Date()
              });
              return true;
            }

            this.addBestMatchingProductToCart(rawName, dataRaw);
            return true;
          }

          this.messages.push({
            type: 'assistant',
            text: `He buscado "${rawName}", pero ahora mismo no encuentro un producto que coincida para agregar al carrito.`,
            timestamp: new Date()
          });
          return true;
        }

        this.addBestMatchingProductToCart(rawName, data);
        return true;

      } catch (err) {
        console.error('Error buscando producto para carrito:', err);
        this.messages.push({
          type: 'assistant',
          text: 'Hubo un problema al buscar el producto para tu carrito. Intenta de nuevo más tarde.',
          timestamp: new Date()
        });
        return true;
      }
    },

    // =========================
    // ENVÍO DE MENSAJE
    // =========================
    async sendMessage() {
      const text = this.messageText.trim();
      if (!text || this.isTyping) return;

      this.messages.push({
        type: 'user',
        text: text,
        timestamp: new Date()
      });

      this.messageText = '';
      this.isTyping = true;

      if (this.isFarewell(text)) {
        this.messages.push({
          type: 'assistant',
          text: this.inactivityMessageText,
          timestamp: new Date()
        });
        this.isTyping = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        this.resetInactivityTimer();
        return;
      }

        // 🔹 2) Si YA estamos en flujo de compra guiado, manejar paso y NO llamar backend
        if (this.checkoutState !== 'IDLE') {
          this.handleCheckoutFlowStep(text);
          this.isTyping = false;
          this.$nextTick(() => {
          this.scrollToBottom();
        });
        this.resetInactivityTimer();
        return;
      }

      // 🔹 3) Si el mensaje inicia un flujo de compra (intención comprar/pagar)
      if (this.shouldStartCheckout(text)) {
        this.startCheckoutFlow();
        this.isTyping = false;
        this.$nextTick(() => {
         this.scrollToBottom();
        });
        this.resetInactivityTimer();
        return;
      }

      const handledByCart = await this.tryHandleCartCommand(text);
      if (handledByCart) {
        this.isTyping = false;
        this.$nextTick(() => this.scrollToBottom());
        this.resetInactivityTimer();
        return;
      }

      // 🔹 Intento de manejo de SEGUIMIENTO SIMULADO
      const handledByTracking = await this.tryHandleTrackingCommand(text);
      if (handledByTracking) {
        this.isTyping = false;
        this.$nextTick(() => this.scrollToBottom());
        this.resetInactivityTimer();
        return;
      }

      try {
        const response = await axios.post(this.apiUrl, {
          message: text
        });

        this.messages.push({
          type: 'assistant',
          text: response.data.response,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        this.messages.push({
          type: 'assistant',
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
          timestamp: new Date()
        });
      } finally {
        this.isTyping = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },



    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    startAudio() {
      if (!this.recognition) {
        alert('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome en escritorio.');
        return;
      }

      if (this.isListening) {
        this.recognition.stop();
        return;
      }

      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error al iniciar reconocimiento:', e);
      }
    }
  },

  beforeUnmount() {
    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
    }
  }
}
</script>

<style scoped>
.audio-btn {
  background-color: #b3e34f;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50px;
  transition: all 0.2s;
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-btn:hover:not(:disabled) {
  background-color: #a3d340;
  color: #ffffff;
  border-radius: 60px;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-wrapper {
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 1500;
  display: flex;
  align-items: flex-end;
}

.chat-container {
  width: 100%;
  max-width: 420px;
  height: 560px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  transform-origin: bottom right;
  transition: transform 160ms ease, opacity 160ms ease;
}

.chat-header {
  background: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  font-size: 12px;
  color: #4caf50;
  text-align: left;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-group {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-group.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.assistant-message {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.user-message {
  background: #b3e34f;
  color: white;
  text-align: left;
}

.message-bubble p {
  margin: 0;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

.input-area {
  background: white;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #b3e34f;
}

.message-input::placeholder {
  color: #999;
}

.send-btn {
  background: #b3e34f;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #a3d340;
}

.arrow {
  font-size: 18px;
  color: white;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

@media (max-width: 480px) {
  .chat-wrapper {
    right: 12px;
    bottom: 12px;
  }

  .chat-container {
    width: calc(100vw - 24px);
    max-width: none;
    height: 60vh;
    border-radius: 10px;
  }
}
</style>
