const express = require("express");
const router = express.Router();
const { realizarTransaccion } = require("../controllers/transaccionController");

router.post("/", realizarTransaccion);

module.exports = router;
