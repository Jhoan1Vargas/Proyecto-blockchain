const { poolPromise } = require("../db/db");

async function buscarRoles() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(`
      SELECT Id, Nombre FROM Rol
    `);

  return result.recordset; // devuelve usuarios o undefined
}

module.exports = { 
  buscarRoles
};