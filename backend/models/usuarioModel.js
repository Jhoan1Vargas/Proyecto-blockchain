const { poolPromise } = require("../db/db");

async function buscarUsuarioPorNombreYClave(nombre, clave) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("clave", clave)
    .query(`
      SELECT Id, idRol, Nombre, Contrasena, Correo, FechaCreacion, Estado
      FROM Usuario
      WHERE Nombre = @nombre AND Contrasena = @clave AND Estado = 'A'
    `);

  return result.recordset[0]; // devuelve usuario o undefined
}

async function buscarUsuarioPorId(id) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT Id, idRol, Nombre, Contrasena, Correo, FechaCreacion, Estado
      FROM Usuario
      WHERE Id = @Id
    `);

  return result.recordset[0]; // devuelve usuario o undefined
}

async function buscarUsuarios() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(`
      SELECT Id, IdRol, Nombre, Contrasena, Correo, Estado
      FROM Usuario
    `);

  return result.recordset; // devuelve usuarios o undefined
}

async function insertarUsuario(nombre, clave, correo, idrol, estado) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("clave", clave)
    .input("correo", correo)
    .input("idrol", idrol)
    .input("estado", estado)
    .query(`
      INSERT INTO Usuario(Nombre, Contrasena, Correo, IdRol, Estado)
      VALUES(@nombre, @clave, @correo, @idrol, @estado)
    `);

  return result.recordset; // devuelve usuarios o undefined
}


async function actualizarUsuario(id, nombre, clave, correo, idrol, estado) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", id)
    .input("nombre", nombre)
    .input("clave", clave)
    .input("correo", correo)
    .input("idrol", idrol)
    .input("estado", estado)
    .query(`
      UPDATE Usuario SET 
      Nombre = @nombre,
      Contrasena = @clave,
      Correo = @correo,
      IdRol = @idrol,
      Estado = @estado
      WHERE Id = @id
    `);

  return result.rowsAffected[0]; 
}


module.exports = { 
  buscarUsuarioPorId,
  buscarUsuarioPorNombreYClave,
  buscarUsuarios,
  insertarUsuario,
  actualizarUsuario
};
