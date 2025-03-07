import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 10000
});

// Interceptor de solicitudes para incluir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Recupera el token del almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token a la cabecera
    }
    return config;
  },
  (error) =>  Promise.reject(error)
);

// Interceptor de respuestas para manejar errores globales
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error en la respuesta:", errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default api;
