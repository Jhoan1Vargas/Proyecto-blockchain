const express = require("express");
const cors = require("cors");
const validarApiKey = require("./middleware/apiKeyMiddleware")
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth",validarApiKey);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
