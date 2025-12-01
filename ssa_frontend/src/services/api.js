import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://backendssa.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor para adjuntar el JWT en cada petición protegida
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Adjuntar el token en el formato Bearer <token>
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * @function createPedido
 * Crea un nuevo pedido enviando el DTO al backend usando la instancia apiClient (con JWT).
 * @param {object} pedidoData DTO del pedido (direccionEnvio, total, detalles).
 * @returns {Promise<object>} Los datos de respuesta del pedido creado.
 */
export async function createPedido(pedidoData) {
    try {
        // Axios ya maneja automáticamente el JSON.stringify(data)
        const response = await apiClient.post('/pedidos', pedidoData);
        
        // Axios retorna la data directamente en response.data
        return response.data; 

    } catch (error) {
        // Manejo de errores centralizado (401, 404, 500, etc.)
        let errorMsg = "Ha ocurrido un error inesperado al procesar el pedido.";
        let statusCode = 500;
        
        if (error.response) {
            // El servidor respondió con un estado fuera de 2xx
            statusCode = error.response.status;
            errorMsg = error.response.data.message || error.response.statusText;
        } else if (error.request) {
            // La petición se hizo, pero no se recibió respuesta (ej. servidor caído)
            errorMsg = "No se pudo conectar con el servidor. Verifica que Spring Boot esté funcionando.";
        } else {
            // Algo más causó el error
            errorMsg = error.message;
        }
        
        // Relanzamos un error más detallado para que la vista lo capture
        throw new Error(`[${statusCode}] ${errorMsg}`);
    }
}




export default apiClient;