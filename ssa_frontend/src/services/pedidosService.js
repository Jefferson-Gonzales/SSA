// src/services/pedidosService.js
import axios from 'axios';

const API_URL = 'https://backendssa.onrender.com/api/pedidos';

export const getMisPedidos = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token. Inicia sesión nuevamente.');
  }

  const { data } = await axios.get(`${API_URL}/mis-pedidos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data; // array de DtoPedidoRespuesta
};

export const getPedidoPorId = async (idPedido) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token. Inicia sesión nuevamente.');
  }

  const { data } = await axios.get(`${API_URL}/mis-pedidos/${idPedido}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data; // un solo DtoPedidoRespuesta
};
