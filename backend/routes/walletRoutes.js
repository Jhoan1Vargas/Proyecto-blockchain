const express = require("express");
const router = express.Router();
const { crearWallet } = require("../controllers/walletController");

router.post("/crear", crearWallet);

module.exports = router;
