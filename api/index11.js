import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Puedes usar una variable de entorno para la URL base
const BASE_URL = "http://192.168.1.68:8000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para construir la URL de las imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Simplificar la lógica
  return imagePath.startsWith('/') 
    ? `http://192.168.1.68:8000${imagePath}`
    : `http://192.168.1.68:8000/media/${imagePath}`;
};

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Considera remover el console.log en producción
      console.log("Token agregado a la petición");
    }
    return config;
  } catch (error) {
    console.error("Error en interceptor:", error);
    return config;
  }
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.log("Error 401 - No autorizado, removiendo tokens");
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      // Opcional: redirigir al login
      // navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;