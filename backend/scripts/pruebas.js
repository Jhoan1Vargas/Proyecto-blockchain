const { realizarTransaccion } = require("../controllers/transaccionController");

async function main() {
  const req = {
    body: {
      idUsuarioOrigen: 1,
      idWalletOrigen: 1,
      idUsuarioDestino: 1,
      idWalletDestino: 2,
      monto: 50,
    }
  };
  const res = null;

  await realizarTransaccion(req, res);

}

main()
  .then(() => {
    console.log("Test finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
