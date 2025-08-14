import api from "../api";

const API_URL = "/api/wallets";

export const obtenerWallets = async (usuario) => {
  try {
    const response = await api.get(`${API_URL}/${usuario.Id}`);
    const data = response.data;

    if (data && data.esValido === true) {
      return { esValido: true, wallets: data.wallets };
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

export const agregarWallet = async (usuario) => {
  try {
    const response = await api.post(`${API_URL}/${usuario.Id}/crear`);   
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