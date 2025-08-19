const { hashClave, verificarClave } = require("../utils/seguridad");
const { poolPromise } = require("../db/db");

async function buscarUsuarioPorNombre(nombre) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("nombre", nombre)
    .query(`
      SELECT Id, idRol, Nombre, Contrasena, Correo, FechaCreacion, Estado
      FROM Usuario
      WHERE Nombre = @nombre AND Estado = 'A'
    `);

  return result.recordset[0] || null; // devuelve usuario o undefined
}

async function loginUsuario(nombre, clave) {
  const usuario = await buscarUsuarioPorNombre(nombre);
  if (!usuario) return null;

  const match = await verificarClave(clave, usuario.Contrasena);
  if (!match) return null;

  return usuario;
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

  return result.recordset[0] || []; // devuelve usuario o undefined
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
  const hashedClave = await hashClave(clave);

  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("clave", hashedClave)
    .input("correo", correo)
    .input("idrol", idrol)
    .input("estado", estado)
    .query(`
      INSERT INTO Usuario(Nombre, Contrasena, Correo, IdRol, Estado)
      VALUES(@nombre, @clave, @correo, @idrol, @estado)
    `);

  return result.rowsAffected[0]; // devuelve usuarios o undefined
}


async function actualizarUsuario(id, nombre, correo, idrol, estado) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("id", id)
    .input("nombre", nombre)
    .input("correo", correo)
    .input("idrol", idrol)
    .input("estado", estado)
    .query(`
      UPDATE Usuario SET 
      Nombre = @nombre,
      Correo = @correo,
      IdRol = @idrol,
      Estado = @estado
      WHERE Id = @id
    `);

  return result.rowsAffected[0]; 
}


module.exports = { 
  loginUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorNombre,
  buscarUsuarios,
  insertarUsuario,
  actualizarUsuario
};
