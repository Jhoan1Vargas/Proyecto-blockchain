const { poolPromise } = require("../db/db");
const { actualizarBalanceWallet } = require("../models/walletModel");


async function guardarTransaccion(transaccion) {
  const query = `
    INSERT INTO Transaccion 
      (HashTx, Tipo, IdWalletOrigen, IdUsuarioOrigen, IdWalletDestino, IdUsuarioDestino, Monto, 
      BalanceOrigenAntes, BalanceOrigenDespues, BalanceDestinoAntes, BalanceDestinoDespues, Estado, Red) 
    VALUES 
      (@HashTx, @Tipo, @IdWalletOrigen, @IdUsuarioOrigen, @IdWalletDestino, @IdUsuarioDestino, @Monto, 
      @BalanceOrigenAntes, @BalanceOrigenDespues, @BalanceDestinoAntes, @BalanceDestinoDespues, @Estado, @Red);
    SELECT SCOPE_IDENTITY() AS id;
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("HashTx",                transaccion.HashTx)
      .input("Tipo",                  transaccion.Tipo)
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

    return result.recordset[0].id;
  } catch (error) {
    console.error("Error guardarTransaccion:", error);
    throw error;
  }
}

async function actualizarEstadoTransaccion(id,transaccion) {
  const query = `
    UPDATE Transaccion SET 
    HashTx = @HashTx,
    BalanceOrigenDespues = @BalanceOrigenDespues,
    BalanceDestinoDespues = @BalanceDestinoDespues,
    Estado = @Estado
    WHERE Id = @Id AND Estado = 'P'
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("HashTx",                transaccion.HashTx)
      .input("BalanceOrigenDespues",  transaccion.BalanceOrigenDespues)
      .input("BalanceDestinoDespues", transaccion.BalanceDestinoDespues)
      .input("Estado",                transaccion.Estado)
      .input("Id",                    id)
      .query(query);

    if (transaccion.Estado === 'A') {
      await actualizarBalanceWallet(transaccion.IdWalletOrigen,  transaccion.IdUsuarioOrigen, (-1 * transaccion.Monto));
      await actualizarBalanceWallet(transaccion.IdWalletDestino, transaccion.IdUsuarioDestino,  transaccion.Monto);
    }

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Error actualizarEstadoTransaccion:", error);
    throw error;
  }
}

module.exports = {
  guardarTransaccion,
  actualizarEstadoTransaccion,
}