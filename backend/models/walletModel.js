const { poolPromise } = require("../db/db");
const { encriptar} = require("../utils/seguridad")

async function buscarWalletPorIdUsuario(idUsuario, mayorQueCero) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", idUsuario)
    .query(`
      SELECT Id, IdUsuario, Direccion, Balance, FechaCreacion 
      FROM Wallet
      WHERE IdUsuario = @id ${mayorQueCero ? "AND Balance > 0":""}
      ORDER BY Balance
    `);
  return result.recordset; // devuelve una lista de wallets o undefined
}

async function guardarWalletIdUsuario({idUsuario, direccion, llavePrivada, mnemonic, balance}) {
  const pool = await poolPromise;
  const id = await buscarMaxIdWalletPorIdUsuario(idUsuario) + 1;
  const result = await pool
    .request()
    .input("id", id)
    .input("idusuario", idUsuario)
    .input("direccion", direccion)
    .input("llaveprivada", llavePrivada)
    .input("mnemonic", mnemonic)
    .input("balance", balance)
    .query(`
      INSERT INTO Wallet(Id,IdUsuario, Direccion, LlavePrivada, Mnemonic, Balance)
      VALUES(@id, @idusuario, @direccion, @llaveprivada, @mnemonic, @balance)
    `);
  return result.rowsAffected[0] > 0; 
}

async function buscarMaxIdWalletPorIdUsuario(idUsuario) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", idUsuario)
    .query(`
      SELECT ISNULL(MAX(Id),0) AS Id FROM Wallet WHERE IdUsuario = @id
    `);
  return result.recordset[0].Id;
}


async function buscarIdWalletPorId(id, idUsuario) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", id)
    .input("idusuario", idUsuario)
    .query(`
      SELECT Id, IdUsuario, Direccion, LlavePrivada, Mnemonic, Balance
      FROM Wallet
      WHERE Id = @id AND IdUsuario = @idusuario
    `);

  return result.recordset.length === 0 ? null : result.recordset[0];
}

async function actualizarBalanceWallet(id, idUsuario, monto) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("monto", monto)
    .input("id", id)
    .input("idusuario", idUsuario)
    .query(`
      UPDATE Wallet SET Balance = Balance + @monto, FechaActualizacion = GETDATE() WHERE Id = @id AND idUsuario = @idusuario
    `);

  return result.rowsAffected[0] > 0; 
}

async function tieneBalanceDisponible({idUsuario, idWallet, monto}) {
  let query = `
    SELECT U.Id, U.IdRol, R.Nombre, U.Nombre, U.Contrasena, U.Correo, U.FechaCreacion, U.Estado, COUNT(W.Id) AS CantidadWallets, SUM(W.Balance) AS BalanceActual 
    FROM Usuario U 
    INNER JOIN Wallet W ON U.Id = W.IdUsuario
    INNER JOIN Rol R ON U.IdRol = R.Id
    WHERE U.Id = @idUsuario ${idWallet ? "AND W.Id = @idWallet" : ""}
    GROUP BY U.Id, U.IdRol, R.Nombre, U.Nombre, U.Contrasena, U.Correo, U.FechaCreacion, U.Estado
    HAVING SUM(W.Balance) >= @monto
  `
  const pool = await poolPromise;
  const request = await pool 
    .request()
    .input("idUsuario", idUsuario)
    .input("monto", monto)
  
    if (idWallet){
    request.input("idWallet", idWallet);
  }

  const result = await request.query(query);

  return result.recordset.length > 0; 
}



module.exports = {
  buscarWalletPorIdUsuario,
  guardarWalletIdUsuario,
  buscarIdWalletPorId,
  actualizarBalanceWallet,
  tieneBalanceDisponible,
}