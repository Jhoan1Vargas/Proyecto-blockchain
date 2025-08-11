const { poolPromise } = require("../db/db");
const { actualizarBalanceWallet } = require("../models/walletModel");


async function guardarTransaccion(transaccion) {
  const query = `
    INSERT INTO Transaccion 
      (HashTx, IdWalletOrigen, IdUsuarioOrigen, IdWalletDestino, IdUsuarioDestino, Monto, 
      BalanceOrigenAntes, BalanceOrigenDespues, BalanceDestinoAntes, BalanceDestinoDespues, Estado, Red) 
    VALUES 
      (@HashTx, @IdWalletOrigen, @IdUsuarioOrigen, @IdWalletDestino, @IdUsuarioDestino, @Monto, 
      @BalanceOrigenAntes, @BalanceOrigenDespues, @BalanceDestinoAntes, @BalanceDestinoDespues, @Estado, @Red);
    SELECT SCOPE_IDENTITY() AS id;
  `;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input("HashTx",                transaccion.HashTx)
      .input("IdWalletOrigen",        transaccion.IdWalletOrigen)
      .input("IdUsuarioOrigen",       transaccion.IdUsuarioOrigen)
      .input("IdWalletDestino",       transaccion.IdWalletDestino)
      .input("IdUsuarioDestino",      transaccion.IdUsuarioDestino)
      .input("Monto",                 transaccion.Monto)
      .input("BalanceOrigenAntes",    transaccion.BalanceOrigenAntes)
      .input("BalanceOrigenDespues",  transaccion.BalanceOrigenDespues)
      .input("BalanceDestinoAntes",   transaccion.BalanceDestinoAntes)
      .input("BalanceDestinoDespues", transaccion.BalanceDestinoDespues)
      .input("Estado",                transaccion.Estado)
      .input("Red",                   transaccion.Red)
      .query(query);

    await actualizarBalanceWallet(transaccion.IdUsuarioOrigen, transaccion.IdWalletOrigen, (-1 * transaccion.Monto));
    await actualizarBalanceWallet(transaccion.IdUsuarioDestino, transaccion.IdWalletDestino, transaccion.Monto);

    return result.recordset[0].id;
  } catch (error) {
    console.error("Error guardarTransaccion:", error);
    throw error;
  }
}

module.exports = {
  guardarTransaccion
}