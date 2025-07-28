require("dotenv").config();

function validarApiKey(req, res, next) {
  const apiKeyCliente = req.headers["x-netherium-key"];

  if (!apiKeyCliente) {
    return res.status(403).json({ mensaje: "API_KEY faltante" });
  }

  const apiKeyServidor = process.env.API_KEY;

  if (apiKeyCliente !== apiKeyServidor) {
    return res.status(403).json({ mensaje: "API_KEY inválida\n" + apiKeyCliente });
  }

  next();
}

module.exports = validarApiKey;
