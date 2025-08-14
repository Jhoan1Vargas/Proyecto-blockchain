const express = require("express");
const router = express.Router();
const { realizarTransaccion, realizarCompra, realizarVenta } = require("../controllers/transaccionController");

router.post("/", realizarTransaccion);
router.post("/compra", realizarCompra);
router.post("/venta", realizarVenta);

module.exports = router;
