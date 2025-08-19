import { Box, Button, TextField, useTheme, Typography, FormControl, Autocomplete } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useState, useContext, useEffect } from 'react';
import { obtenerWallets, obtenerTodasWallets } from "../../services/walletService"
import { realizarTransferencia, obtenerPrecioETH } from "../../services/transService"
import { obtenerUsuarios } from "../../services/authService"
import { GlobalContext } from "../../components/GlobalContext"
import ModalMensaje from "../../components/ModalMensaje";
import { Link } from "react-router-dom";


const Transferencia = ({abrirForm, usarWalletPropias}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [walletsOrigen, setWalletsOrigen] = useState([]);
  const [walletsDestino, setWalletsDestino] = useState([]);
  const [usuariosDestino, setUsuariosDestino] = useState([]);
  const { usuarioActual } = useContext(GlobalContext);
  const [balanceFocus, setBalanceFocus] = useState(false);
  const [tasaCambio, setTasaCambio] = useState(1);

  const [abrirModalMensaje, setAbrirModalMensaje] = useState(false);
  const [tituloMensaje, setTituloMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");
  const [enEspera, setEnEspera] = useState(false);

  const CargarWalletsOrigen = async () => {
    try {
        const data = await obtenerWallets(!usuarioActual ? {Id: 0} : usuarioActual);
        setWalletsOrigen(data.wallets);
      } catch (error) {
        console.error("Error cargando wallets de origen:", error);
      }
  }

  const CargarUsuariosDestino = async () => {
    try {
        const data = await obtenerUsuarios();
        const usuarios = data.usuarios;
        const usuariosFiltrados = usuarios.filter(u => usarWalletPropias ?  u.Id === usuarioActual.Id : u.Id !== usuarioActual.Id && u.Id !== 1 && u.Estado === "A");
        setUsuariosDestino(usuariosFiltrados);
      } catch (error) {
        console.error("Error cargando usuarios de destino:", error);
      }
  }

  const CargarWalletsDestino = async (idUsuarioDestino) => {
    try {
        if (usarWalletPropias)
        {
          const data = await obtenerWallets(!usuarioActual ? {Id: 0} : usuarioActual);
          setWalletsDestino(data.wallets);
          return;
        }

        const data = await obtenerTodasWallets(!usuarioActual ? {Id: 0} : usuarioActual);
        const wallets = data.wallets;
        const walletsFiltradas = idUsuarioDestino ? wallets.filter(w => w.IdUsuario === idUsuarioDestino) : wallets;
        setWalletsDestino(walletsFiltradas);
      } catch (error) {
        console.error("Error cargando wallets de destino:", error);
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
      CargarWalletsOrigen();
      CargarWalletsDestino();
      CargarUsuariosDestino();
      CargarTasaCambio();
    }
  }, []);

  const handleFormSubmit = async (values) => {
    try 
    {
      const transaccion = {
        idUsuarioOrigen: usuarioActual.Id,
        idWalletOrigen: values.idWalletOrigen,
        idUsuarioDestino: values.idUsuarioDestino,
        idWalletDestino: values.idWalletDestino,
        monto: parseFloat(values.montoETH.replace(/,/g, "")),
      }

      values.idUsuarioDestino = "";
      values.idWalletOrigen = "";
      values.idWalletDestino = "";
      values.montoETH = "";
      values.montoUSD = "";
      values.tarjeta = "";

      setTituloMensaje("Realizando Transferencia de Ethereum...");
      setContenidoMensaje("Esperando que se realice la venta de Ethereum");
      setEnEspera(true)
      setAbrirModalMensaje(true)

      const data = await realizarTransferencia(transaccion);

      if(!data.esValido) {
        setTituloMensaje("Situación inesperada");
        setContenidoMensaje(!data.error ? "Error inesperado al realizar la transferencia de Ethereum" : data.error);
        setEnEspera(false);
        setAbrirModalMensaje(true);
        return;
      }

      setTituloMensaje("Transferencia de Ethereum Exitosa");
      setContenidoMensaje(data.mensaje);
      setEnEspera(false);
      setAbrirModalMensaje(true);

      CargarWalletsOrigen();
      CargarWalletsDestino();
      CargarTasaCambio();

    } catch (error) {

      setTituloMensaje("Error inesperado");
      setContenidoMensaje(error ? "Error inesperado al realizar la transferencia de Ethereum" : error);
      setEnEspera(false);
      setAbrirModalMensaje(true)

    }
  };

  return (
    <Box m="20px">
      <Header title="Transferencia de Ethereum" subtitle={usarWalletPropias ? "Realizar transferencia entre mis wallets" : "Realizar transferencia a terceros"} />
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
                        borderBottomColor: !!touched.idWalletOrigen && !!errors.idWalletOrigen ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.idWalletOrigen && !!errors.idWalletOrigen ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.idWalletOrigen ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.idWalletOrigen && errors.idWalletOrigen
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                        fontWeight: "bold"
                    },
                }}
                error={!!touched.idWalletOrigen && !!errors.idWalletOrigen}
              >
                <Autocomplete
                  options={walletsOrigen.sort((a,b) => a.Id - b.Id)}
                  noOptionsText="No se encontraron wallets"
                  getOptionLabel={(wallet) =>
                    `${wallet.Id} - ${wallet.Direccion}`
                  }
                  value={walletsOrigen.find(w => w.Id === values.idWalletOrigen) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: { name: "idWalletOrigen", value: newValue ? newValue.Id : "" }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Wallet de Origen"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.idWalletOrigen && !!errors.idWalletOrigen}
                      helperText={touched.idWalletOrigen && errors.idWalletOrigen ? errors.idWalletOrigen : ""}
                    />
                  )}
                />
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Balance Actual USD"
                onChange={handleChange}
                name="balanceActual"
                sx={{ 
                  gridColumn: "span 1",
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
                    color: values.idWalletOrigen ? colors.grey[300]: colors.grey[100] ,
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
                  values.idWalletOrigen ? 
                  `${(walletsOrigen.find(w => w.Id === values.idWalletOrigen)?.Balance * tasaCambio).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) ?? 0} USD` 
                  : ""
                }
                slotProps={{
                  input: {
                    readOnly: true, 
                  }, 
                  inputLabel:{
                    shrink: values.idWalletOrigen || balanceFocus ? true : false,
                  }
                }}
                onFocus={() => setBalanceFocus(true)}
                onBlur ={() => setBalanceFocus(false)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Balance Actual ETH"
                onChange={handleChange}
                name="balanceActual"
                sx={{ 
                  gridColumn: "span 1",
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
                    color: values.idWalletOrigen ? colors.grey[300]: colors.grey[100] ,
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
                  values.idWalletOrigen ? 
                  `${walletsOrigen.find(w => w.Id === values.idWalletOrigen)?.Balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 18 
                  }) ?? 0} ETH` 
                  : ""
                }
                slotProps={{
                  input: {
                    readOnly: true, 
                  }, 
                  inputLabel:{
                    shrink: values.idWalletOrigen || balanceFocus ? true : false,
                  }
                }}
                onFocus={() => setBalanceFocus(true)}
                onBlur ={() => setBalanceFocus(false)}
              />
              {!usarWalletPropias && <FormControl
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
                        borderBottomColor: !!touched.idUsuarioDestino && !!errors.idUsuarioDestino ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.idUsuarioDestino && !!errors.idUsuarioDestino ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.idUsuarioDestino ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.idUsuarioDestino && errors.idUsuarioDestino
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                        fontWeight: "bold"
                    },
                }}
                error={!!touched.idUsuarioDestino && !!errors.idUsuarioDestino}
              >
                <Autocomplete
                  disabled = {usarWalletPropias}
                  options={usuariosDestino.sort((a,b) => a.Id - b.Id)}
                  noOptionsText="No se encontraron usuarios"
                  getOptionLabel={(usuario) =>
                    `${usuario.Id} - ${usuario.Nombre}`
                  }
                  value={usuariosDestino.find(u => u.Id === values.idUsuarioDestino) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: { name: "idUsuarioDestino", value: newValue ? newValue.Id : "" }
                    });
                    CargarWalletsDestino(newValue ? newValue.Id : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Usuario Destino"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.idUsuarioDestino && !!errors.idUsuarioDestino}
                      helperText={touched.idUsuarioDestino && errors.idUsuarioDestino ? errors.idUsuarioDestino : ""}
                    />
                  )}
                />
              </FormControl>}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ 
                  gridColumn: usarWalletPropias ? "span 4" : "span 2",
                  '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], 
                      },
                      '&:before': {
                        borderBottomColor: !!touched.idWalletDestino && !!errors.idWalletDestino ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.idWalletDestino && !!errors.idWalletDestino ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.idWalletDestino ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.idWalletDestino && errors.idWalletDestino
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                        fontWeight: "bold"
                    },
                }}
                error={!!touched.idWalletDestino && !!errors.idWalletDestino}
              >
                <Autocomplete
                  options={walletsDestino.sort((a,b) => a.Id - b.Id)}
                  noOptionsText="No se encontraron wallets"
                  getOptionLabel={(wallet) =>
                    usarWalletPropias ? `${wallet.Id} - ${wallet.Direccion}` : `${wallet.Direccion}`
                  }
                  value={walletsDestino.find(w => w.Id === values.idWalletDestino && w.IdUsuario === values.idUsuarioDestino) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: { name: "idWalletDestino", value: newValue ? newValue.Id : "" }
                    });
                    setFieldValue("idUsuarioDestino", newValue ? newValue.IdUsuario : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Wallet Destino"
                      variant="filled"
                      onBlur={handleBlur}
                      error={!!touched.idWalletDestino && !!errors.idWalletDestino}
                      helperText={touched.idWalletDestino && errors.idWalletDestino ? errors.idWalletDestino : ""}
                    />
                  )}
                />
              </FormControl>
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
                  maximumFractionDigits: 2 
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
                      fontWeight: "bold",
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
                      fontWeight: "bold",
                  },
                }}
                value={values.montoETH}
                error={!!touched.montoETH && !!errors.montoETH}
                helperText={touched.montoETH && errors.montoETH}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Box gap="10px" width="50%" display="flex" justifyContent="end">
                <Button variant="contained" sx={{
                  flex:0.60,
                  backgroundColor: colors.redAccent[600],
                  ":hover": { backgroundColor: colors.redAccent[700]},
                }}
                component={Link}
                to="/transacciones"
                >
                  <Typography
                    variant="h6"
                    color={colors.grey[100]}
                    fontWeight= "bold"
                  >
                  Salir
                  </Typography>
                </Button>
                <Button variant="contained" sx={{
                  flex:0.60,
                  backgroundColor: colors.blueAccent[600],
                  ":hover": { backgroundColor: colors.blueAccent[700]},
                }}
                onClick={() => {
                  setFieldValue("idUsuarioDestino", "");
                  setFieldValue("idWalletOrigen", "");
                  setFieldValue("idWalletDestino", "");
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
                  Realizar Transferencia de Ethereum
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
  idUsuarioDestino: yup.string().trim().required("Campo Requerido"),
  idWalletOrigen: yup.string().trim().required("Campo Requerido"),
  idWalletDestino: yup.string().trim().required("Campo Requerido"),
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
  idUsuarioDestino: "",
  idWalletOrigen: "",
  idWalletDestino: "",
  montoUSD: "",
  montoETH: "",
  tarjeta: "",
};

export default Transferencia;