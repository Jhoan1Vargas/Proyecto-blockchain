const express = require("express");
const router = express.Router();
const { 
  crearWallet,
  buscarWalletsUsuario,
  consultaWallets,
} = require("../controllers/walletController");

router.post("/:id/crear", crearWallet);
router.get("/:id", buscarWalletsUsuario);
router.post("/", consultaWallets);

module.exports = router;
