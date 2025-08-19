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

async function buscarTransacciones() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(`
      SELECT
        T.Id, T.HashTx, T.Tipo, 
        T.IdUsuarioOrigen, UO.Nombre NombreUsuarioOrigen, T.IdWalletOrigen, WO.Direccion DireccionWalletOrigen, WO.Balance BalanceActualWalletOrigen,
        T.BalanceOrigenAntes, T.BalanceOrigenDespues,
        T.IdUsuarioDestino, UD.Nombre NombreUsuarioDestino, T.IdWalletDestino, WD.Direccion DireccionWalletDestino, WD.Balance BalanceActualWalletDestino,
        T.BalanceDestinoAntes, T.BalanceDestinoDespues,
        T.Monto, T.Estado, T.Red, T.FechaCreacion
      FROM Transaccion T
      INNER JOIN Usuario UO ON T.IdUsuarioOrigen = UO.Id
      INNER JOIN Usuario UD ON T.IdUsuarioDestino = UD.Id
      INNER JOIN Wallet WO ON T.IdWalletOrigen = WO.Id AND T.IdUsuarioOrigen = WO.IdUsuario
      INNER JOIN Wallet WD ON T.IdWalletDestino = WD.Id AND T.IdUsuarioDestino = WD.IdUsuario
      ORDER BY T.ID 
    `);
  return result.recordset; // devuelve una lista de wallets o undefined
}

module.exports = {
  guardarTransaccion,
  actualizarEstadoTransaccion,
  buscarTransacciones,
}