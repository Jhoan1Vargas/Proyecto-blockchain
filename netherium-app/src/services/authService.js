// src/services/authService.js
import api from "../api";

export const login = async (correo, clave) => {
  try {
    const response = await api.post("/api/auth/login", { correo, clave });
    // Puedes guardar el usuario o token aquí si el backend lo devuelve
    const data = response.data;

    // Verifica si el login fue exitoso (puedes personalizar según tu backend)
    if (data && data.esValido === true) {
      return { esValido: true, data };
    } else {
      return { esValido: false, error: data?.mensaje|| "Error desconocido" };
    }
  } catch (error) {
    return {
      esValido: false,
      error: error.response?.data?.mensaje || "Error de conexión con el servidor",
    };
  }
};
