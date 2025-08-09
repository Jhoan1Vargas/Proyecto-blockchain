const express = require("express");
const router = express.Router();
const { 
  crearWallet,
  buscarWalletsUsuario
} = require("../controllers/walletController");

router.post("/:id/crear", crearWallet);
router.get("/:id", buscarWalletsUsuario);

module.exports = router;
