const { realizarTransaccion, realizarCompra } = require("../controllers/transaccionController");

async function main() {
  const req = {
    body: {
      idUsuarioDestino: 2,
      idWalletDestino: 1,
      monto: 50,
    }
  };
  const res = null;

  await realizarCompra(req, res);

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
