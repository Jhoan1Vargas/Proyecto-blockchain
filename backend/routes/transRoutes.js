const express = require("express");
const router = express.Router();
const { realizarTransaccion, realizarCompra, realizarVenta, consultarTransacciones } = require("../controllers/transaccionController");

router.get("/", consultarTransacciones);
router.post("/transferencia", realizarTransaccion);
router.post("/compra", realizarCompra);
router.post("/venta", realizarVenta);

module.exports = router;
