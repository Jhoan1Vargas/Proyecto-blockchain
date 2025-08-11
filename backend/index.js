const express = require("express");
const cors = require("cors");
const validarApiKey = require("./middleware/apiKeyMiddleware")
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes")
const transRoutes = require("./routes/transRoutes")

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api",validarApiKey);

app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transaccion", transRoutes);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
