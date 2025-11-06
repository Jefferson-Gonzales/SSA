import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
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



export default apiClient;