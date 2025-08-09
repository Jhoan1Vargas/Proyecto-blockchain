import { Box, ButtonBase, Typography, TextField, useTheme } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/es"; 
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Header from "../../components/Header";
import { useState, useEffect, useContext } from "react";
import { agregarWallet, obtenerWallets } from "../../services/walletService"
import  ModalMensaje  from "../../components/ModalMensaje"
import { GlobalContext } from "../../components/GlobalContext"
import { format } from 'date-fns'



const Wallet = (abrirForm) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [abrirModalMensaje, setAbrirModalMensaje] = useState(false);
  const [tituloMensaje, setTituloMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");

  const [verFiltros, setVerFiltros] = useState(false);

  const [balanceMin, setBalanceMin] = useState("");
  const [balanceMax, setBalanceMax] = useState("");
  const [fechaMin, setFechaMin] = useState(null);
  const [fechaMax, setFechaMax] = useState(null);


  const [wallets, setWallets] = useState([]);
  const { usuarioActual, textoBusqueda } = useContext(GlobalContext);

  const walletsFiltrados = wallets.filter((wallet) =>{
    
    const cumpleTexto = wallet.Id.toString().includes(textoBusqueda.toLowerCase()) ;
    const cumpleBalanceMin = balanceMin === "" || Number(wallet.Balance) >= Number(balanceMin);
    const cumpleBalanceMax = balanceMax === "" || Number(wallet.Balance) <= Number(balanceMax);
    const fechaCreacion = new Date(wallet.FechaCreacion);
    const cumpleFechaMin = !fechaMin || fechaCreacion >= fechaMin;    
    const cumpleFechaMax = !fechaMax || fechaCreacion <= fechaMax;

    return cumpleTexto && cumpleBalanceMin && cumpleBalanceMax && cumpleFechaMin && cumpleFechaMax;
  });

  const columnas = [
    { field: "Id", 
      headerName: "ID",
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({row}) => {
        return(
          <Box
            display="flex"
            justifyContent="left"
            alignItems="center"
            width="100%"
            gap="10%"
          >
          <Typography>{row.Id}</Typography>
          </Box>
        );
      }
    },
    {
      field: "Direccion",
      headerName: "Direccion",
      flex: 1,
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({row}) => {
        
        if (!row.Direccion) return "";
        const direccion = row.Direccion;
        
        const handleCopiar = () => {
          navigator.clipboard.writeText(row.Direccion);
          alert("Dirección copiada!");
        };

        return(
        <Box
          onClick={handleCopiar} 
          display="flex"
          justifyContent="start"
          alignItems="center"
          width="100%"
          gap="10%"
          style={{ cursor: "pointer" }}
          title="Click para copiar"
        >
          <Typography>{direccion}</Typography>
        </Box>
        );
      }
    },
    {
      field: "Balance",
      headerName: "Balance",
      flex: 1,
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({row}) => {
        const balanceFormateado = Number(row.Balance).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        });

        return(
          <Box
            display="flex"
            justifyContent="left"
            alignItems="center"
            width="100%"
            gap="10%"
          >
          <Typography>{`NTH ${balanceFormateado}`}</Typography>
          </Box>
        );
      }
    },
    {
      field: "FechaCreacion",
      headerName: "Fecha de Creación",
      flex: 0.5,
      headerClassName: "custom-header",
      cellClassName: "objeto-centrado--cell",
      renderCell: ({row}) => {
        if (!row.FechaCreacion) return "";
        const date = new Date(row.FechaCreacion.replace("Z",""));
        console.log(date);
        if (isNaN(date)) return "";

        return (
          <Box
            display="flex"
            justifyContent="left"
            alignItems="center"
            width="100%"
            gap="10%"
          >
          <Typography>{format(date, "dd/MM/yyyy hh:mm:ss a")}</Typography>
          </Box>
        );
      }
    },
  ];


  const CargarWallets = async () => {
    try {
        const data = await obtenerWallets(usuarioActual);
        console.log(data.wallets);
        setWallets(data.wallets);
      } catch (error) {
        console.error("Error cargando wallets:", error);
      }
  }


  useEffect(() => {
    if (abrirForm) {
      CargarWallets();
    }
  }, []);

  const handleAgregarWallet = async () => {
    try 
    {
      const data = await agregarWallet(usuarioActual);
      
      if(!data.esValido) {
        setTituloMensaje("Situación inesperada");
        setContenidoMensaje(data.error ? "Error inesperado al Agregar Wallet" : data.error);
        setAbrirModalMensaje(true)
        return;
      }

      setTituloMensaje("Agregar Wallet");
      setContenidoMensaje(data.data.mensaje );
      setAbrirModalMensaje(true);
    } catch (error) {

      setTituloMensaje("Error inesperada");
      setContenidoMensaje(error ? "Error inesperado al Agregar Wallet" : error);
      setAbrirModalMensaje(true)

    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="flex-start" width="100%" alignItems="center">
          <Header title="Wallets" subtitle="Wallets del usuario" />
        </Box>
        <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center" gap="10px">
          <ButtonBase
          sx={{
            minWidth: "25%",
            backgroundColor: colors.blueAccent[600],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "4px",
            ":hover": { backgroundColor: colors.blueAccent[700]},
          }}
          onClick={CargarWallets}
          >
          <RefreshOutlinedIcon sx={{mr:"5px"}}/>
          Refrescar
          </ButtonBase>
          <ButtonBase
          sx={{
            minWidth: "25%",
            backgroundColor: colors.yellowAccent[600],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "4px",
            ":hover": { backgroundColor: colors.yellowAccent[700]},
          }}
          onClick={() => {setVerFiltros(!verFiltros)}}
          >
          <FilterAltOutlinedIcon sx={{mr:"5px"}}/>
          Filtros Adicionales
          </ButtonBase>
          <ButtonBase
          sx={{
            minWidth: "25%",
            backgroundColor: colors.greenAccent[700],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "4px",
            ":hover": { backgroundColor: colors.greenAccent[800] },
          }}
          onClick={async () => {
            await handleAgregarWallet();
            await CargarWallets();
          }}
          >
          <SaveOutlinedIcon sx={{mr:"5px"}}/>
          Nueva Wallet
          </ButtonBase>
        </Box> 
      </Box>
      <ModalMensaje
        abrir={abrirModalMensaje}
        cerrarModal={() => setAbrirModalMensaje(false)}
        titulo={tituloMensaje}
        mensaje={contenidoMensaje}
      />

      {verFiltros && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
            <TextField 
              label="Balance Mínimo"
              type="number"
              value={balanceMin}
              onChange={e => setBalanceMin(e.target.value)}
              variant="filled"
              size="medium"
              sx={{ 
                width: 150,
                '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]': { MozAppearance: 'textfield' },
                '& .MuiFilledInput-root': {
                  color: colors.grey[100],
                  '&:after': {
                    borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                  },
                  '&:before': {
                    borderBottomColor: colors.grey[100], // <-- color por defecto (antes del focus)
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottomColor: colors.blueAccent[300], // <-- hover
                  },
                },
                '& .MuiInputLabel-root': {
                  color: balanceMin ? colors.grey[300] : colors.grey[100] ,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.grey[300] ,
                },
              }}
            />
            <TextField
              label="Balance Máximo"
              type="number"
              value={balanceMax}
              onChange={e => setBalanceMax(e.target.value)}
              variant="filled"
              size="medium"
              sx={{ 
                width: 150,
                '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]': { MozAppearance: 'textfield' },
                '& .MuiFilledInput-root': {
                  color: colors.grey[100],
                  '&:after': {
                    borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                  },
                  '&:before': {
                    borderBottomColor: colors.grey[100], // <-- color por defecto (antes del focus)
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottomColor: colors.blueAccent[300], // <-- hover
                  },
                },
                '& .MuiInputLabel-root': {
                  color: balanceMax ? colors.grey[300] : colors.grey[100] ,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.grey[300] ,
                },
              }}
            />
            <DatePicker
              label="Fecha Mínima"
              value={fechaMin}
              onChange={(newValue) => setFechaMin(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: 180 }}/>}
              slotProps={{
                textField:{
                  variant:"filled",
                  sx: {
                    '& .MuiPickersInputBase-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                      },
                      '&:before': {
                        borderBottomColor: colors.grey[100], // <-- color por defecto (antes del focus)
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: colors.blueAccent[300], // <-- hover
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: fechaMin ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                  }
                }
              }}
            />
            <DatePicker
              label="Fecha Máxima"
              value={fechaMax}
              onChange={(newValue) => setFechaMax(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: 180 }}/>}
              slotProps={{
                textField:{
                  variant:"filled",
                  sx: {
                    '& .MuiPickersInputBase-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                      },
                      '&:before': {
                        borderBottomColor: colors.grey[100], // <-- color por defecto (antes del focus)
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: colors.blueAccent[300], // <-- hover
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: fechaMax ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                  }
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      )}

      <Box
        m="21px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: `${colors.blueAccent[700]} !important`,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-row--borderBottom": {
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .objeto-centrado--cell": {
            alignContent: "center",
          },
          "& .custom-header": {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid 
        rows={walletsFiltrados} 
        columns={columnas} 
        getRowId={(row) => row.Id}
        isRowSelectable={() => false}
        disableColumnResize
        />
      </Box>
    </Box>
  );
};

export default Wallet;