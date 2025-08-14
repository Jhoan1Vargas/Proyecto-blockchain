import { Box, Button, TextField, useTheme, Typography, FormControl, Autocomplete } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useState, useContext, useEffect } from 'react';
import { obtenerWallets } from "../../services/walletService"
import { realizarCompra, obtenerPrecioETH } from "../../services/transService"
import { GlobalContext } from "../../components/GlobalContext"
import ModalMensaje from "../../components/ModalMensaje";


const Compra = ({abrirForm}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [wallets, setWallets] = useState([]);
  const { usuarioActual } = useContext(GlobalContext);
  const [balanceFocus, setBalanceFocus] = useState(false);
  const [tasaCambio, setTasaCambio] = useState(1);

  const [abrirModalMensaje, setAbrirModalMensaje] = useState(false);
  const [tituloMensaje, setTituloMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");
  const [enEspera, setEnEspera] = useState(false);

  const CargarWallets = async () => {
    try {
        const data = await obtenerWallets(!usuarioActual ? {Id: 0} : usuarioActual);
        setWallets(data.wallets);
      } catch (error) {
        console.error("Error cargando wallets:", error);
      }
  }

  const CargarTasaCambio = async () => {
    try {
        const data = await obtenerPrecioETH();
        setTasaCambio(data.tasa || 1);
      } catch (error) {
        console.error("Error cargando wallets:", error);
      }
  }

  useEffect(() => {
    if (abrirForm) {
      CargarWallets();
      CargarTasaCambio();
    }
  }, []);

  const handleFormSubmit = async (values) => {
    try 
    {
      const transaccion = {
        idUsuarioDestino: usuarioActual.Id,
        idWalletDestino: values.idWallet,
        monto: parseFloat(values.montoETH.replace(/,/g, "")),
      }

      values.idWallet = "";
      values.montoETH = "";
      values.montoUSD = "";
      values.tarjeta = "";


      setTituloMensaje("Realizando Compra de Ethereum...");
      setContenidoMensaje("Esperando que se realice la compra de Ethereum");
      setEnEspera(true)
      setAbrirModalMensaje(true)

      const data = await realizarCompra(transaccion);

      if(!data.esValido) {
        setTituloMensaje("Situación inesperada");
        setContenidoMensaje(data.error ? "Error inesperado al realizar la compra de Ethereum" : data.error);
        setEnEspera(false);
        setAbrirModalMensaje(true);
        return;
      }

      setTituloMensaje("Compra de Ethereum Exitosa");
      setContenidoMensaje(data.mensaje);
      setEnEspera(false);
      setAbrirModalMensaje(true);

    } catch (error) {
      setTituloMensaje("Error inesperado");
      setContenidoMensaje(error ? "Error inesperado al realizar la compra de Ethereum" : error);
      setEnEspera(false);
      setAbrirModalMensaje(true)

    }
  };

  return (
    <Box m="20px">
      <Header title="Comprar Ethereum" subtitle="Realizar compra de Ethereum" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                backgroundColor: colors.primary[400],
                padding: "15px",
                borderRadius: "4px",
              }}
            >

              <FormControl
                fullWidth
                variant="filled"
                sx={{ 
                  gridColumn: "span 2",
                  '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], 
                      },
                      '&:before': {
                        borderBottomColor: !!touched.idWallet && !!errors.idWallet ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.idWallet && !!errors.idWallet ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.idWallet ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.idWallet && errors.idWallet
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                        fontWeight: "normal"
                    },
                }}
                error={!!touched.idWallet && !!errors.idWallet}
              >
                <Autocomplete
                  options={wallets}
                  noOptionsText="No se encontraron wallets"
                  getOptionLabel={(wallet) =>
                    `${wallet.Id} - ${wallet.Direccion}`
                  }
                  value={wallets.find(w => w.Id === values.idWallet) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: { name: "idWallet", value: newValue ? newValue.Id : "" }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Wallet"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.idWallet && !!errors.idWallet}
                      helperText={touched.idWallet && errors.idWallet ? errors.idWallet : ""}
                    />
                  )}
                />
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Balance Actual"
                onChange={handleChange}
                name="balanceActual"
                sx={{ 
                  gridColumn: "span 2",
                  '& .MuiFilledInput-root': {
                    color: colors.grey[100],
                    '&:after': {
                      borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                    },
                    '&:before': {
                      borderBottomColor: colors.grey[600], // <-- color por defecto (antes del focus)
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: colors.blueAccent[300], // <-- hover
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: values.idWallet ? colors.grey[300]: colors.grey[100] ,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.grey[300] ,
                  },
                  "& .MuiFormHelperText-root": {
                    color: touched.userName && errors.userName
                      ? colors.blueAccent[300]  // Si hay error
                      : colors.grey[300],      // Si no hay error
                  },
                }}
                value={
                  values.idWallet ? 
                  `${wallets.find(w => w.Id === values.idWallet)?.Balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8 
                  }) ?? 0} ETH` 
                  : ""
                }
                slotProps={{
                  input: {
                    readOnly: true, 
                  }, 
                  inputLabel:{
                    shrink: values.idWallet || balanceFocus ? true : false,
                  }
                }}
                onFocus={() => setBalanceFocus(true)}
                onBlur ={() => setBalanceFocus(false)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tasa de Cambio"
                onChange={handleChange}
                onBlur ={handleBlur}
                name="tasaCambio"
                sx={{ 
                  gridColumn: "span 2",
                  '& .MuiFilledInput-root': {
                    color: colors.grey[100],
                    '&:after': {
                      borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                    },
                    '&:before': {
                      borderBottomColor: colors.grey[600], // <-- color por defecto (antes del focus)
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: colors.blueAccent[300], // <-- hover
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: tasaCambio ? colors.grey[300]: colors.grey[100] ,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.grey[300] ,
                  },
                }}
                value={`1 ETH = ${
                  tasaCambio.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8 
                  })
                } USD`}
                slotProps={{
                  input: {
                    readOnly: true, 
                  }, 
                  inputLabel:{
                    shrink: tasaCambio ? true : false,
                  }
                }}
              />
              <Box sx={{ gridColumn: "span 2" }} />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Monto de Compra en USD"
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^0-9.]/g, "")
                  const usd = valor;
                  setFieldValue("montoUSD", usd.toLocaleString(undefined,{ minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  setFieldValue("montoETH", "");
                  if (tasaCambio > 0 && usd > 0) {
                    const eth = usd / tasaCambio;
                    setFieldValue("montoETH", eth.toLocaleString(undefined,{ minimumFractionDigits: 2, maximumFractionDigits: 18 }));
                  }
                }}
                onBlur={() => {
                  if (values.montoUSD) {
                    const formatted = parseFloat(values.montoUSD.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    setFieldValue("montoUSD", formatted);
                  }
                }}
                name="montoUSD"
                sx={{  
                  gridColumn: "span 2",
                  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' },
                  '& .MuiFilledInput-root': {
                    color: colors.grey[100],
                    '&:after': {
                      borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                    },
                    '&:before': {
                      borderBottomColor: !!touched.montoUSD && !!errors.montoUSD ? colors.blueAccent[300]: colors.grey[600], // <-- color por defecto (antes del focus)
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: !!touched.montoUSD && !!errors.montoUSD ? colors.blueAccent[300]: colors.grey[400], // <-- hover
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: values.montoUSD ? colors.grey[300]: colors.grey[100] ,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.grey[300] ,
                  },
                  "& .MuiFormHelperText-root": {
                    color: touched.montoUSD && errors.montoUSD
                      ? colors.blueAccent[300]  // Si hay error
                      : colors.grey[300],      // Si no hay error
                      fontWeight: "normal",
                  },
                }}
                value={values.montoUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                error={!!touched.montoUSD && !!errors.montoUSD}
                helperText={touched.montoUSD && errors.montoUSD}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Monto de Compra en ETH"
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^0-9.]/g, "")
                  const eth = valor;
                  setFieldValue("montoETH", eth.toLocaleString(undefined,{ minimumFractionDigits: 2, maximumFractionDigits: 18 }));
                  setFieldValue("montoUSD", "");
                  if (tasaCambio > 0 && eth > 0) {
                    const usd = eth * tasaCambio;
                    setFieldValue("montoUSD", usd.toLocaleString(undefined,{ minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  }
                }}
                onBlur={() => {
                  if (values.montoETH) {
                    const formatted = parseFloat(values.montoETH.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 18 });
                    setFieldValue("montoETH", formatted);
                  }
                }}
                name="montoETH"
                sx={{ 
                  gridColumn: "span 2",
                  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' },
                  '& .MuiFilledInput-root': {
                    color: colors.grey[100],
                    '&:after': {
                      borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                    },
                    '&:before': {
                      borderBottomColor: !!touched.montoETH && !!errors.montoETH ? colors.blueAccent[300]: colors.grey[600], // <-- color por defecto (antes del focus)
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottomColor: !!touched.montoETH && !!errors.montoETH ? colors.blueAccent[300]: colors.grey[400], // <-- hover
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: values.montoETH ? colors.grey[300]: colors.grey[100],
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.grey[300] ,
                  },
                  "& .MuiFormHelperText-root": {
                    color: touched.montoETH && errors.montoETH
                      ? colors.blueAccent[300]  // Si hay error
                      : colors.grey[300],      // Si no hay error
                      fontWeight: "normal",
                  },
                }}
                value={values.montoETH}
                error={!!touched.montoETH && !!errors.montoETH}
                helperText={touched.montoETH && errors.montoETH}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Box gap="10px" width="40%" display="flex" justifyContent="end">
                <Button variant="contained" sx={{
                  flex:0.60,
                  backgroundColor: colors.blueAccent[600],
                  ":hover": { backgroundColor: colors.blueAccent[700]},
                }}
                onClick={() => {
                  setFieldValue("idWallet", "");
                  setFieldValue("montoUSD", "");
                  setFieldValue("montoETH", "");
                  setFieldValue("tarjeta", "");
                }}
                >
                  <Typography
                    variant="h6"
                    color={colors.grey[100]}
                    fontWeight= "bold"
                  >
                  Limpiar
                  </Typography>
                </Button>
                <Button type="submit" variant="contained" sx={{
                  flex:1,
                  backgroundColor: colors.greenAccent[700],
                  ":hover": { backgroundColor: colors.greenAccent[800]},
                }}>
                  <Typography
                    variant="h6"
                    color={colors.grey[100]}
                    fontWeight= "bold"
                  >
                  Realizar Compra de Ethereum
                  </Typography>
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
      <ModalMensaje
        abrir={abrirModalMensaje}
        cerrarModal={() => setAbrirModalMensaje(false)}
        titulo={tituloMensaje}
        mensaje={contenidoMensaje}
        enEspera={enEspera}
      />
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  idWallet: yup.string().trim().required("Campo Requerido"),
  montoUSD: yup
              .number()
              .transform((value, originalValue) => {
                if (typeof originalValue === "string") {
                  return parseFloat(originalValue.replace(/,/g, ""));
                }
                return value;
              })
              .typeError("Debe ser un número")
              .required("Campo Requerido")
              .min(0.01, "El monto en USD debe ser mayor que 0.01"),
  montoETH: yup
              .number()
              .transform((value, originalValue) => {
                if (typeof originalValue === "string") {
                  return parseFloat(originalValue.replace(/,/g, ""));
                }
                return value;
              })
              .typeError("Debe ser un número")
              .required("Campo Requerido")
  // tarjeta: yup.string().required("Campo Requerido"),
});
const initialValues = {
  idWallet: "",
  montoUSD: "",
  montoETH: "",
  tarjeta: "",
};

export default Compra;