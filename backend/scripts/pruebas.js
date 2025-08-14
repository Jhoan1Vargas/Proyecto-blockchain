const { realizarTransaccion, realizarCompra,realizarVenta } = require("../controllers/transaccionController");

async function main() {
  const req = {
    body: {
      idUsuarioOrigen: 2,
      idWalletOrigen: 1,
      monto: 0.0001,
    }
  };
  const res = null;

  await realizarVenta(req, res);

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
