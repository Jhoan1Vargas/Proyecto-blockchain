const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Conexión a Base de Datos satisfactoria!!");
    return pool;
  })
  .catch(err => console.error("No se pudo conectar a la Base de Datos:\n", err));

module.exports = {
  sql, poolPromise
};
