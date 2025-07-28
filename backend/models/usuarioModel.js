const { poolPromise } = require("../db/db");

async function buscarUsuarioPorCorreoYClave(correo, clave) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("correo", correo)
    .input("clave", clave)
    .query(`
      SELECT Id, Correo, Contrasena, FechaCreacion
      FROM Usuario
      WHERE Correo = @correo AND Contrasena = @clave
    `);

  return result.recordset[0]; // devuelve usuario o undefined
}

async function buscarUsuarios() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(`
      SELECT Id, Correo, Contrasena, FechaCreacion
      FROM Usuario
    `);

  return result.recordset; // devuelve usuarios o undefined
}

module.exports = { 
  buscarUsuarioPorCorreoYClave,
  buscarUsuarios
};
