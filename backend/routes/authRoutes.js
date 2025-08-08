const express = require("express");
const { 
  login, 
  consultaUsuarios,
  agregarUsuario,
  modificarUsuario,
  consultaRoles,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/usuarios", consultaUsuarios);
router.post("/usuarios", agregarUsuario);
router.put("/usuarios/:id", modificarUsuario);

router.get("/roles",consultaRoles)

module.exports = router;
