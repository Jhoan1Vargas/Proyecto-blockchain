const { ethers } = require("ethers");
const { guardarTransaccion, actualizarEstadoTransaccion } = require("../models/transaccionModel");
const { 
  buscarIdWalletPorId, tieneBalanceDisponible, buscarWalletPorIdUsuario 
} = require("../models/walletModel");

const realizarTransaccion = async (req, res) => {
  const {
    idUsuarioOrigen,
    idWalletOrigen,
    idUsuarioDestino,
    idWalletDestino,
    monto,
  } = req.body;

  try {
    const tieneBalance = await tieneBalanceDisponible({idUsuario: idUsuarioOrigen, idWallet: idWalletOrigen, monto: monto})
    if (!tieneBalance) {
      return res.status(404).json({ mensaje: "No hay balance disponible para realizar la compra", esValido: false });
    }

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
      Tipo:                   "T",
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
      Tipo:                   'C',
      IdWalletOrigen:         idWalletOrigen,
      IdUsuarioOrigen:        idUsuarioOrigen,
      IdWalletDestino:        idWalletDestino,
      IdUsuarioDestino:       idUsuarioDestino,
      Monto:                  montoUsado,
      BalanceOrigenAntes:     balanceOrigenAntes.toString(),
      BalanceOrigenDespues:   balanceOrigenDespues.toString(),
      BalanceDestinoDespues:  balanceDestinoDespues.toString(),
      BalanceDestinoAntes:    balanceDestinoAntes.toString(),
      Estado:                 txReceipt.status === 1 ? "A": "R",
      Red:                    "Hardhat",
    });

    res.status(201).json({ mensaje: "Transacción realizada con éxito", esValido: true, idTx, hashTx: txReceipt.transactionHash });

  } catch (error) {
    console.error("Error realizarTransaccion:", error);
    res.status(500).json({ mensaje: "Error interno al realizar la transacción", esValido: false });
  }
};

const realizarCompra = async (req, res) => {
  const {
    idUsuarioDestino,
    idWalletDestino,
    monto,
  } = req.body;

  const idUsuarioOrigen = 1;
  try {
    if (idUsuarioOrigen === idUsuarioDestino) {
      return res.status(404).json({ mensaje: "No se puede realizar una compra con el usuario banco por consistencia de datos", esValido: false });
    }

    const tieneBalance = await tieneBalanceDisponible({idUsuario: idUsuarioOrigen, monto: monto});
    if (!tieneBalance) {
      return res.status(404).json({ mensaje: "No hay balance disponible para realizar la compra", esValido: false });
    }

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
    let walletsOrigen = await buscarWalletPorIdUsuario(idUsuarioOrigen, true);
    let montoRestante = monto;

    for(let i = 0; montoRestante > 0 && i < walletsOrigen.length; i++){
      let idWalletOrigen = walletsOrigen[i].Id;
      const montoDisponible = walletsOrigen[i].Balance;
      const montoUsado = Math.min(montoDisponible, montoRestante);

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
        value: ethers.parseEther(montoUsado.toString()),
      });

      // Guardar en BD en Espera de Respuesta
      const idTx = await guardarTransaccion({
        HashTx:                 null,
        Tipo:                   'C',
        IdWalletOrigen:         idWalletOrigen,
        IdUsuarioOrigen:        idUsuarioOrigen,
        IdWalletDestino:        idWalletDestino,
        IdUsuarioDestino:       idUsuarioDestino,
        Monto:                  montoUsado,
        BalanceOrigenAntes:     balanceOrigenAntes.toString(),
        BalanceOrigenDespues:   null,
        BalanceDestinoAntes:    balanceDestinoAntes.toString(),
        BalanceDestinoDespues:  null,
        Estado:                 "P",
        Red:                    "Hardhat",
      });


      // Esperar confirmación
      const txReceipt = await txResponse.wait();

      let balanceOrigenDespues = balanceOrigenAntes;
      let balanceDestinoDespues = balanceDestinoAntes;

      //Asegurar que la red refleje los cambios
      do{
        await provider.waitForTransaction(txResponse.hash);

        // Consultar balances después
        const balanceWeiOrigenDespues = await provider.getBalance(walletOrigen.Direccion);
        balanceOrigenDespues = ethers.formatEther(balanceWeiOrigenDespues);

        const balanceWeiDestinoDespues = await provider.getBalance(walletDestino.Direccion);
        balanceDestinoDespues = ethers.formatEther(balanceWeiDestinoDespues);

      } while(balanceOrigenAntes === balanceOrigenDespues && balanceDestinoAntes === balanceDestinoDespues);

      await actualizarEstadoTransaccion(
        idTx,
        {
        HashTx:                 txReceipt.transactionHash,
        Tipo:                   'C',
        IdWalletOrigen:         idWalletOrigen,
        IdUsuarioOrigen:        idUsuarioOrigen,
        IdWalletDestino:        idWalletDestino,
        IdUsuarioDestino:       idUsuarioDestino,
        Monto:                  montoUsado,
        BalanceOrigenAntes:     balanceOrigenAntes.toString(),
        BalanceOrigenDespues:   balanceOrigenDespues.toString(),
        BalanceDestinoDespues:  balanceDestinoDespues.toString(),
        BalanceDestinoAntes:    balanceDestinoAntes.toString(),
        Estado:                 txReceipt.status === 1 ? "A": "R",
        Red:                    "Hardhat",
      });

      montoRestante -= montoUsado;
    }
    res.status(201).json({ mensaje: "Compra de Ethereum realizada con éxito", esValido: true });

  } catch (error) {
    console.error("Error realizarCompra:", error);
    res.status(500).json({ mensaje: "Error interno al realizar la compra", esValido: false });
  }
};

module.exports = { realizarTransaccion, realizarCompra };
