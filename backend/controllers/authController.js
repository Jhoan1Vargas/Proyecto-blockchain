const { 
  buscarUsuarioPorCorreoYClave, 
  buscarUsuarios
} = require("../models/usuarioModel");

async function login(req, res) {
  const { correo, clave } = req.body;

  try {
    const usuario = await buscarUsuarioPorCorreoYClave(correo, clave);

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

module.exports = { 
  login,
  consultaUsuarios
};
