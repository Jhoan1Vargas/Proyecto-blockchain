const express = require("express");
const router = express.Router();
const { realizarTransaccion, realizarCompra } = require("../controllers/transaccionController");

router.post("/", realizarTransaccion);
router.post("/compra", realizarCompra);

module.exports = router;
