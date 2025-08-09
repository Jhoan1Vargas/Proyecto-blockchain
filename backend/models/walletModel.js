const { poolPromise } = require("../db/db");
const { encriptar} = require("../utils/seguridad")

async function buscarWalletPorIdUsuario(idUsuario) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", idUsuario)
    .query(`
      SELECT Id, IdUsuario, Direccion, Balance, FechaCreacion 
      FROM Wallet
      WHERE IdUsuario = @id
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
    .input("llaveprivada", encriptar(llavePrivada))
    .input("mnemonic", encriptar(mnemonic))
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


module.exports = {
  buscarWalletPorIdUsuario,
  guardarWalletIdUsuario,
}