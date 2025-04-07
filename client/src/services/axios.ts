import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, 
  withCredentials: true,
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
  (error) =>  Promise.reject(new Error(error))
);

// Interceptor de respuestas para manejar errores globales
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
