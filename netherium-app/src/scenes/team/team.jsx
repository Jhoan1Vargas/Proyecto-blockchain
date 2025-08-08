import { Box, ButtonBase, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Header from "../../components/Header";
import { useState, useEffect, useContext } from "react";
import { obtenerUsuarios, agregarUsuario, modificarUsuario} from "../../services/authService"
import { Roles, NombrarRol, OrigenUsuario } from "../../data/constantes"
import  ModalUsuario  from "../../components/ModalUsuario"
import  ModalMensaje  from "../../components/ModalMensaje"
import { SearchContext } from "../../components/SearchContext"


const Team = (abrirForm) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { textoBusqueda } = useContext(SearchContext);

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalMensaje, setAbrirModalMensaje] = useState(false);
  const [tituloMensaje, setTituloMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");
  const [usuarioEditar, setUsuarioEditar] = useState(0);
  const [origen, setOrigen] = useState(0);

  const [usuarios, setUsuarios] = useState([]);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.Id.toString().includes(textoBusqueda.toLowerCase()) ||
    usuario.Nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
    usuario.Correo.toLowerCase().includes(textoBusqueda.toLowerCase()) 
  );

  const columnas = [
    { field: "Id", 
      headerName: "ID",
      headerClassName: "custom-header",
    },
    {
      field: "Nombre",
      headerName: "Usuario",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "custom-header",
    },
    {
      field: "Correo",
      headerName: "Correo",
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "IdRol",
      headerName: "Nivel de Usuario",
      flex: 0.70,
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({ row: { IdRol } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignSelf="center"
            backgroundColor={
              IdRol === Roles.ADMIN
                ? colors.redAccent[600]
                : IdRol === Roles.USER
                ? colors.orangeAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {IdRol === Roles.ADMIN && <AdminPanelSettingsOutlinedIcon />}
            {IdRol === Roles.USER && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {NombrarRol(IdRol)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Estado",
      headerName: "Estado",
      flex: 0.60,
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({ row: { Estado } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignSelf="center"
            backgroundColor={
              Estado === "A"
                ? colors.greenAccent[700]
                : colors.grey[500]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {
                Estado === "A" ? "Activo" : "Inactivo"
              }
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      flex: 0.4,
      cellClassName: "objeto-centrado--cell",
      headerClassName: "custom-header",
      renderCell: ({row}) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="5%"
            width="100%"
          >
            <ButtonBase
              onClick={() => handleEditarUsuario (row)}
              sx={{
                width:"33%",
                margin:"0 auto",
                padding:"5px",
                display:"flex",
                justifyContent:"center",
                alignSelf:"center",
                backgroundColor: colors.yellowAccent[500],
                ":hover": { backgroundColor: colors.yellowAccent[600] },
                borderRadius:"4px",
              }}
            >
              <EditOutlinedIcon/>
            </ButtonBase>
            <ButtonBase
            onClick={() => handleEliminarUsuario(row)}
            sx={{
                width:"33%",
                margin:"0 auto",
                padding:"5px",
                display:"flex",
                justifyContent:"center",
                alignSelf:"center",
                backgroundColor: colors.redAccent[500],
                ":hover": { backgroundColor: colors.redAccent[600] },
                borderRadius:"4px",
              }}
            >
              <DeleteOutlineOutlinedIcon/>
            </ButtonBase>
          </Box>
        );
      },
    },
  ];


  const CargarUsuario = async () => {
    try {
        const data = await obtenerUsuarios();
        setUsuarios(data.usuarios);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
  }

  useEffect(() => {
    if (abrirForm) {
      CargarUsuario();
    }
  }, [abrirForm]);

  
  const handleAbrirModalNuevo = () => {
    setUsuarioEditar({id: -1});
    setOrigen(OrigenUsuario.USUARIO_NUEVO)
    setAbrirModal(true);
  };

  const handleEditarUsuario = (data) => {
    const usuario = {
      id:     data.Id,
      nombre: data.Nombre,
      clave:  data.Contrasena,
      correo: data.Correo,
      idrol:  data.IdRol,
      estado: data.Estado,
    }

    setUsuarioEditar(usuario);
    setOrigen(OrigenUsuario.USUARIO_EDITAR)
    setAbrirModal(true);
  };

  const handleEliminarUsuario = (usuario) => {
    const dato = {
      idUser:   usuario.Id,
      userName: usuario.Nombre, 
      clave:    usuario.Contrasena, 
      correo:   usuario.Correo, 
      idRol:    usuario.IdRol, 
      estado:   "I",
    };
    GuardarUsuario(dato, "Eliminar Usuario", "Se ha eliminado el usuario satisfactoriamente")
  };

  const GuardarUsuario = async (dato, titulo, mensaje) => {
    const usuario = {
      id:       dato.idUser,
      nombre:   dato.userName, 
      clave:    dato.clave, 
      correo:   dato.correo, 
      idrol:    dato.idRol, 
      estado:   dato.estado,
    }
    try 
    {
      const data = (usuario.id > 0) ? await modificarUsuario(usuario) : await agregarUsuario(usuario);
      if(!data.esValido) {
        setTituloMensaje("Situación inesperada");
        setContenidoMensaje(data.error ? "Error inesperado al " + titulo : data.error);
        setAbrirModalMensaje(true)
        return;
      }

      setTituloMensaje(titulo);
      setContenidoMensaje(!!mensaje ? mensaje : data.data.mensaje );
      setAbrirModalMensaje(true);
    } catch (error) {

      setTituloMensaje("Error inesperada");
      setContenidoMensaje(error ? "Error inesperado al " + titulo : error);
      setAbrirModalMensaje(true)

    }

    CargarUsuario();
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Usuarios" subtitle="Usuarios en la red" />
        <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center" gap="10px">
          <ButtonBase
          sx={{
            minWidth: "15%",
            backgroundColor: colors.blueAccent[600],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "4px",
            ":hover": { backgroundColor: colors.blueAccent[700]},
          }}
          onClick={CargarUsuario}
          >
          <RefreshOutlinedIcon sx={{mr:"5px"}}/>
          Refrescar
          </ButtonBase>
          <ButtonBase
          sx={{
            minWidth: "15%",
            backgroundColor: colors.greenAccent[700],
            color: colors.grey[100],
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "4px",
            ":hover": { backgroundColor: colors.greenAccent[800] },
          }}
          onClick={handleAbrirModalNuevo}
          >
          <SaveOutlinedIcon sx={{mr:"5px"}}/>
          Nuevo
          </ButtonBase>
        </Box> 
      </Box>
      <ModalUsuario
        abrir={abrirModal}
        cerrarModal={() => setAbrirModal(false)}
        origen={origen}
        onSubmit={(dato) => {
          GuardarUsuario(dato, usuarioEditar.id > 0 ? "Actualizar Usuario": "Crear Usuario Nuevo", "")
          setAbrirModal(false);
        }}
        usuarioEditar={usuarioEditar}
      />
      <ModalMensaje
        abrir={abrirModalMensaje}
        cerrarModal={() => setAbrirModalMensaje(false)}
        titulo={tituloMensaje}
        mensaje={contenidoMensaje}
      />
      <Box
        m="40px 0 0 0"
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
          },
        }}
      >
        <DataGrid 
        rows={usuariosFiltrados} 
        columns={columnas} 
        getRowId={(row) => row.Id}
        isRowSelectable={() => false}
        />
      </Box>
    </Box>
  );
};

export default Team;