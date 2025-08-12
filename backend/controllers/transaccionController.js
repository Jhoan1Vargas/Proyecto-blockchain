const { ethers } = require("ethers");
const { guardarTransaccion, actualizarEstadoTransaccion } = require("../models/transaccionModel");
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
    const walletFirmante = new ethers.Wallet(llaveprivada, provider);

    // Consultar balances antes
    const balanceWeiOrigenAntes = await provider.getBalance(walletOrigen.Direccion);
    const balanceOrigenAntes = ethers.formatEther(balanceWeiOrigenAntes);

    const balanceWeiDestinoAntes = await provider.getBalance(walletDestino.Direccion);
    const balanceDestinoAntes = ethers.formatEther(balanceWeiDestinoAntes);

    // Preparar la transacción
    const txResponse = await walletFirmante.sendTransaction({
      to: walletDestino.Direccion,
      value: ethers.parseEther(monto.toString()),
    });

    // Guardar en BD en Espera de Respuesta
    const idTx = await guardarTransaccion({
      HashTx:                 null,
      IdWalletOrigen:         idWalletOrigen,
      IdUsuarioOrigen:        idUsuarioOrigen,
      IdWalletDestino:        idWalletDestino,
      IdUsuarioDestino:       idUsuarioDestino,
      Monto:                  monto,
      BalanceOrigenAntes:     balanceOrigenAntes.toString(),
      BalanceOrigenDespues:   null,
      BalanceDestinoAntes:    balanceDestinoAntes.toString(),
      BalanceDestinoDespues:  null,
      Estado:                 "P",
      Red:                    "Hardhat",
    });


    // Esperar confirmación
    const txReceipt = await txResponse.wait();

    //Asegurar que la red refleje los cambios
    await provider.waitForTransaction(txResponse.hash);

    // Consultar balances después
    const balanceWeiOrigenDespues = await provider.getBalance(walletOrigen.Direccion);
    const balanceOrigenDespues = ethers.formatEther(balanceWeiOrigenDespues);

    const balanceWeiDestinoDespues = await provider.getBalance(walletDestino.Direccion);
    const balanceDestinoDespues = ethers.formatEther(balanceWeiDestinoDespues);


    await actualizarEstadoTransaccion(
      idTx,
      {
      HashTx:                 txReceipt.transactionHash,
      Monto:                  monto,
      BalanceOrigenDespues:   balanceOrigenDespues.toString(),
      BalanceDestinoDespues:  balanceDestinoDespues.toString(),
      Estado:                 txReceipt.status === 1 ? "A": "R",
    });

    res.status(201).json({ mensaje: "Transacción realizada con éxito", esValido: true, idTx, hashTx: txReceipt.transactionHash });

  } catch (error) {
    console.error("Error realizarTransaccion:", error);
    res.status(500).json({ mensaje: "Error interno al realizar la transacción", esValido: false });
  }
};

module.exports = { realizarTransaccion };
