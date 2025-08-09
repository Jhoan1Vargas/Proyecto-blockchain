import { Box, IconButton, useTheme, Menu, MenuItem} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutLinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContext"
import  ModalUsuario  from "../../components/ModalUsuario"
import  ModalMensaje  from "../../components/ModalMensaje"
import { OrigenUsuario } from "../../data/constantes"
import { modificarUsuario} from "../../services/authService"


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const { setTextoBusqueda, usuarioActual, setUsuarioActual, } = useContext(GlobalContext);
  const [nombreMenu, setnombreMenu] = useState("");

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalMensaje, setAbrirModalMensaje] = useState(false);
  const [tituloMensaje, setTituloMensaje] = useState("");
  const [contenidoMensaje, setContenidoMensaje] = useState("");
  const [usuarioEditar, setUsuarioEditar] = useState([]);


  const handleEditarUsuario = (data) => {
    const usuario = {
      id:     data.Id,
      nombre: data.Nombre,
      clave:  data.Contrasena,
      correo: data.Correo,
      idrol:  data.idRol,
      estado: data.Estado,
    }

    setUsuarioEditar(usuario);
    setAbrirModal(true);
  };


  const handleChange = (e) => {
    setTextoBusqueda(e.target.value)
  };

  const handleAbrirMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setnombreMenu(event.currentTarget.id);
  };
  const handleCerrarMenu = () => {
    setAnchorEl(null);
    setnombreMenu("");
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    handleCerrarMenu();
    navigate("/");
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
        const data = await modificarUsuario(usuario);
        if(!data.esValido) {
          setTituloMensaje("Situación inesperada");
          setContenidoMensaje(data.error ? "Error inesperado al " + titulo : data.error);
          setAbrirModalMensaje(true)
          return;
        }
  
        setTituloMensaje(titulo);
        setContenidoMensaje(!!mensaje ? mensaje : data.data.mensaje );
        setAbrirModalMensaje(true);

        setUsuarioActual({
          Id:         usuario.id,
          Nombre:     usuario.nombre,
          Contrasena: usuario.clave,
          Correo:     usuario.correo,
          idRol:      usuario.idrol,
          Estado:     usuario.estado,
        });

      } catch (error) {
  
        setTituloMensaje("Error inesperada");
        setContenidoMensaje(error ? "Error inesperado al " + titulo : error);
        setAbrirModalMensaje(true)
  
      }
    }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box 
      display="flex" 
      backgroundColor = {colors.primary[400]}
      borderRadius= "15px"
      sx={{
        minWidth: "35%"
      }}
      >
        <InputBase onChange={handleChange} sx= {{ ml : 2, flex: 1}} placeholder="Buscar"/>
        <IconButton type="button" sx={{ p : 1 }}>
          <SearchOutlinedIcon/>
        </IconButton>
      </Box>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon/>
          ) : (
            <LightModeOutlinedIcon/>
          )}
        </IconButton>
        {/*
        <IconButton>
          <NotificationsOutlinedIcon/>
        </IconButton>
        */}
        <IconButton id="Perfil" onClick={handleAbrirMenu}>
          <PersonOutLinedIcon/>
        </IconButton>
        {/*
        <IconButton id="Config" onClick={handleAbrirMenu}>
          <SettingsOutLinedIcon/>
        </IconButton>
        */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCerrarMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {nombreMenu === "Perfil" && <MenuItem onClick={() => handleEditarUsuario(usuarioActual)}>Mi Perfil</MenuItem>}
          {nombreMenu === "Perfil" && <MenuItem onClick={handleLogout}>Cambiar Contraseña</MenuItem>}
          {nombreMenu === "Perfil" && <MenuItem onClick={handleLogout}>Salir</MenuItem>}
        </Menu>
      </Box>
      <ModalUsuario
        abrir={abrirModal}
        cerrarModal={() => setAbrirModal(false)}
        origen={OrigenUsuario.USUARIO_EDITAR}
        onSubmit={(dato) => {
          GuardarUsuario(dato, "Actualizar Usuario")
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
    </Box>
  );
}

export default Topbar;