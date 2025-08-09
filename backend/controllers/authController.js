const { 
  loginUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorNombre, 
  buscarUsuarios,
  insertarUsuario,
  actualizarUsuario,
} = require("../models/usuarioModel");

const {
  buscarRoles
} = require("../models/rolesModel")

async function login(req, res) {
  const { nombre, clave } = req.body;

  try {
    const usuario = await loginUsuario(nombre, clave);

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas", esValido: false });
    }

    res.json({ mensaje: "Login exitoso", esValido: true, usuario });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ mensaje: "Error en el servidor" , esValido: false});
  }
}

async function consultaUsuarios(req, res) {
  try {
    const usuarios = await buscarUsuarios();

    if (!usuarios) {
      return res.status(401).json({ mensaje: "No se encontraron usuarios", esValido: false });
    }

    res.json({ mensaje: "Consulta exitosa", esValido: true, usuarios });
  } catch (err) {
    console.error("Error en Consulta:", err);
    res.status(500).json({ mensaje: "Error en el servidor", esValido: false });
  }
}

async function consultaRoles(req, res) {
  try {
    const roles = await buscarRoles();

    if (!roles) {
      return res.status(401).json({ mensaje: "No se encontraron roles", esValido: false });
    }

    res.json({ mensaje: "Consulta exitosa", esValido: true, roles });
  } catch (err) {
    console.error("Error en Consulta:", err);
    res.status(500).json({ mensaje: "Error en el servidor", esValido: false });
  }
}

async function agregarUsuario(req, res) {
  const { nombre, clave, correo, idrol, estado } = req.body;

  try {
    const filas = await insertarUsuario(nombre, clave, correo, idrol, estado);

    if (filas <= 0) {
      return res.status(401).json({ mensaje: "No se pudo agregar el usuario", esValido: false });
    }

    res.json({ mensaje: "Se agregó el usuario satisfactoriamente", esValido: true, filas });
  } catch (err) {
    console.error("Error en agregarUsuario:", err);
    res.status(500).json({ mensaje: "Error en el servidor" , esValido: false});
  }
}

async function modificarUsuario(req, res) {
  const id = req.params.id;
  const { nombre, clave, correo, idrol, estado } = req.body;

  try {
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ mensaje: "No se pudo encontrar el usuario a modificar", esValido: false });

    const filas = await actualizarUsuario(id ,nombre, clave, correo, idrol, estado);

    if (filas <= 0) {
      return res.status(400).json({ mensaje: "No se pudo actualizar los datos del usuario", esValido: false });
    }

    res.json({ mensaje: "Se modificó el usuario satisfactoriamente", esValido: true, filas });
  } catch (err) {
    console.error("Error en modificarUsuario:", err);
    res.status(500).json({ mensaje: "Error en el servidor" , esValido: false});
  }
}

module.exports = { 
  login,
  consultaUsuarios,
  agregarUsuario,
  modificarUsuario,
  consultaRoles,
};
