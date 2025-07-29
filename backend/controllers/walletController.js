const { Wallet } = require("ethers");

const crearWallet = async (req, res) => {
  try {
    const wallet = Wallet.createRandom();

    // Aquí podrías guardar en base de datos: wallet.address, wallet.privateKey, wallet.mnemonic.phrase
    // Nunca envíes la private key al cliente

    res.status(201).json({
      mensaje: "Wallet generada con éxito",
      address: wallet.address,
    });
  } catch (err) {
    console.error("Error al generar wallet:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = { crearWallet };
