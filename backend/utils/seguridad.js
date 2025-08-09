const crypto = require("crypto");
const bcrypt = require('bcrypt');

const ENCRYPT_KEY = process.env.ENCRYPT_KEY; 
const IV_LENGTH = 16;


  // --- HASH CONTRASEÑA ---
  async function hashClave(password) {
    const saltRounds = 10; 
    return await bcrypt.hash(password, saltRounds);
  }

  async function verificarClave(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // --- ENCRIPTAR (AES-256-CBC) ---
  function encriptar(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPT_KEY, "hex"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }


  // --- DESENCRIPTAR ---
  function desencriptar(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPT_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}


module.exports = {
  hashClave,
  verificarClave,
  encriptar,
  desencriptar,
};
