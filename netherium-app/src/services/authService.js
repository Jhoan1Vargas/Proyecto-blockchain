// src/services/authService.js
import api from "../api";

const API_URL = "/api/auth";

export const login = async (nombre, clave) => {
  try {
    const response = await api.post(`${API_URL}/login`, { nombre, clave });    
    const data = response.data;

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

export const obtenerUsuarios = async () => {
  try {
    const response = await api.get(`${API_URL}/usuarios`);
    const data = response.data;

    if (data && data.esValido === true) {
      return { esValido: true, usuarios: data.usuarios };
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

export const agregarUsuario = async (usuario) => {
  try {
    const response = await api.post(
      `${API_URL}/usuarios`, 
      { 
        nombre: usuario.nombre, 
        clave: usuario.clave, 
        correo: usuario.correo, 
        idrol: usuario.idrol, 
        estado: usuario.estado, 
      });    
    const data = response.data;

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

export const modificarUsuario = async (usuario) => {
  try {
    const response = await api.put(
      `${API_URL}/usuarios/${usuario.id}`, 
      { 
        nombre: usuario.nombre, 
        correo: usuario.correo, 
        idrol: usuario.idrol, 
        estado: usuario.estado,
      }); 
        
    const data = response.data;

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

export const obtenerRoles = async () => {
  try {
    const response = await api.get(`${API_URL}/roles`);
    const data = response.data;

    if (data && data.esValido === true) {
      return { esValido: true, roles: data.roles };
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