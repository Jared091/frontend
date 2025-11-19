import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// La URL base debe incluir el prefijo '/api/' que utiliza el backend de Django.
const BASE_URL = "https://agronovaia-cvaga0d6h5fhgmff.mexicocentral-01.azurewebsites.net/api/";

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
  // La URL de las imágenes no suele estar bajo /api/, por lo que se construye desde la raíz del dominio.
  return imagePath.startsWith('/') 
    ? `https://agronovaia-cvaga0d6h5fhgmff.mexicocentral-01.azurewebsites.net${imagePath}`
    : `https://agronovaia-cvaga0d6h5fhgmff.mexicocentral-01.azurewebsites.net${imagePath}`; // Asumiendo que imagePath ya incluye /media/
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