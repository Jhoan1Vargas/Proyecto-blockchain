const express = require("express");
const { 
  login, 
  consultaUsuarios
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/usuarios", consultaUsuarios);

module.exports = router;
