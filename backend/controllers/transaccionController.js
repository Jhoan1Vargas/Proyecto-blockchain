const { ethers } = require("ethers");
const { guardarTransaccion } = require("../models/transaccionModel");
const { buscarIdWalletPorId } = require("../models/walletModel");

const realizarTransaccion = async (req, res) => {
  const {
    idUsuarioOrigen,
    idWalletOrigen,
    idUsuarioDestino,
    idWalletDestino,
    monto,
  } = req.body;

  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const walletOrigen = await buscarIdWalletPorId(idWalletOrigen, idUsuarioOrigen);
    const walletDestino = await buscarIdWalletPorId(idWalletDestino, idUsuarioDestino);

    if (!walletOrigen || !walletDestino) {
      return res.status(404).json({ mensaje: "Wallet origen o destino no encontrada", esValido: false });
    }

    const llaveprivada = walletOrigen.LlavePrivada.toString();
    console.log(typeof(llaveprivada) === "string" && !llaveprivada.startsWith("0x"))

    const walletFirmante = new ethers.Wallet(llaveprivada, provider);

    // Consultar balances antes
    const balanceOrigenAntes = await provider.getBalance(walletOrigen.direccion);
    const balanceDestinoAntes = await provider.getBalance(walletDestino.direccion);


    // Preparar la transacción
    const txResponse = await walletFirmante.sendTransaction({
      to: walletDestino.direccion,
      value: parseEther(monto.toString()),
    });

    // Esperar confirmación
    const txReceipt = await txResponse.wait();

    // Consultar balances después
    const balanceOrigenDespues = await provider.getBalance(walletOrigen.direccion);
    const balanceDestinoDespues = await provider.getBalance(walletDestino.direccion);

    // Guardar en BD
    const idTx = await guardarTransaccion({
      HashTx:                 txReceipt.transactionHash,
      IdWalletOrigen:         idWalletOrigen,
      IdUsuarioOrigen:        idUsuarioOrigen,
      IdWalletDestino:        idWalletDestino,
      IdUsuarioDestino:       idUsuarioDestino,
      Monto:                  monto,
      BalanceOrigenAntes:     balanceOrigenAntes.toString(),
      BalanceOrigenDespues:   balanceOrigenDespues.toString(),
      BalanceDestinoAntes:    balanceDestinoAntes.toString(),
      BalanceDestinoDespues:  balanceDestinoDespues.toString(),
      Estado:                 "A",
      Red:                    "Hardhat",
    });

    res.status(201).json({ mensaje: "Transacción realizada con éxito", esValido: true, idTx, hashTx: txReceipt.transactionHash });

  } catch (error) {
    console.error("Error realizarTransaccion:", error);
    res.status(500).json({ mensaje: "Error interno al realizar la transacción", esValido: false });
  }
};

module.exports = { realizarTransaccion };
