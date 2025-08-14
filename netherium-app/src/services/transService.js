import api from "../api";
import apiCoinGecko from "../apiCoinGecko";

const API_URL = "/api/transaccion";

// export const realizarTransaccion = async (usuario) => {
//   try {
//     const response = await api.get(`${API_URL}/${usuario.Id}`);
//     const data = response.data;

//     if (data && data.esValido === true) {
//       return { esValido: true, wallets: data.wallets };
//     } else {
//       return { esValido: false, error: data?.mensaje|| "Error desconocido" };
//     }
//   } catch (error) {
//     return {
//       esValido: false,
//       error: error.response?.data?.mensaje || "Error de conexión con el servidor",
//     };
//   }
// };

export const realizarCompra = async (transaccion) => {
  try {
    const response = await api.post(
    `${API_URL}/compra`,
    {
      idUsuarioDestino: transaccion.idUsuarioDestino,
      idWalletDestino: transaccion.idWalletDestino,
      monto: transaccion.monto,
    });
    const data = response.data;

    if (data && data.esValido === true) {
      return { esValido: true, mensaje: data?.mensaje };
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


export const obtenerPrecioETH = async () => {
  try {
      const respuesta = await apiCoinGecko.get("/simple/price", {
        params: {
          ids: "ethereum",
          vs_currencies: "usd"
        }
      });
      const data = respuesta.data;
      if (!data) {
        return { esValido: false, error: data?.mensaje|| "Error desconocido" };
      }
      return { esValido: true, tasa: data.ethereum.usd };
  } catch (error) {
    return {
      esValido: false,
      error: error.response?.data?.mensaje || "Error de conexión con el servidor",
    };
  }
}