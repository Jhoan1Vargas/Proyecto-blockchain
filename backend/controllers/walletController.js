const { Wallet } = require("ethers");
const { 
  buscarWalletPorIdUsuario,
  guardarWalletIdUsuario,
} = require("../models/walletModel");

const crearWallet = async (req, res) => {
  const idUsuario = req.params.id;
  try {
    const walletHardHat = Wallet.createRandom();
    const wallet = {
      idUsuario:    idUsuario, 
      direccion:    walletHardHat.address, 
      llavePrivada: walletHardHat.privateKey, 
      mnemonic:     walletHardHat.mnemonic.phrase, 
      balance:      0
    }

    const filas = await guardarWalletIdUsuario(wallet);

    if (!filas) {
      return res.status(401).json({ mensaje: "No se pudo generar la wallet", esValido: false });
    }

    res.status(201).json({ mensaje: "Wallet generada con éxito", esValido: true });
  } catch (err) {
    console.error("Error al generar wallet:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const buscarWalletsUsuario = async (req, res) => {
  const idUsuario = req.params.id;
  try {

    const wallets = await buscarWalletPorIdUsuario(idUsuario);

    if (!wallets) {
      return res.status(401).json({ mensaje: "No se pudo encontrar ninguna wallet relacionada al usuario", esValido: false });
    }

    res.status(201).json({ mensaje: "Consulta de Wallet del usuario existosa", esValido: true, wallets: wallets });
  } catch (err) {
    console.error("Error al consultar wallets del cliente:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = { 
  crearWallet,
  buscarWalletsUsuario 
};
