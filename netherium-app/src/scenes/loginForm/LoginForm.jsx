import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { 
  Box, Button, Typography, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop
} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { InputBase } from '@mui/material';
import { login, agregarUsuario } from "../../services/authService";
import { OrigenUsuario } from "../../data/constantes"
import ModalUsuario from "../../components/ModalUsuario"
import { GlobalContext } from "../../components/GlobalContext"

const LoginForm = ({ setUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalUsuario, setAbrirModalUsuario] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const { setUsuarioActual } = useContext(GlobalContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultado = await login(correo,clave);

    if (resultado.esValido) {
      setUsuarioActual(resultado.data.usuario);
      navigate("/dashboard");
    } else {
      console.log("Login fallido\n" + resultado.error);
      setMensajeError("No se encontró el usuario");
      setAbrirModal(true);
      setClave("");
      setCorreo("");
    }
  };

  const handleCerrarModal = () => {
    setAbrirModal(false);
  }

  const GuardarUsuario = async (dato) => {
      const usuario = {
        nombre:   dato.userName, 
        clave:    dato.clave, 
        correo:   dato.correo, 
        idrol:    dato.idRol, 
        estado:   dato.estado,
      }
  
      try 
      {
        await agregarUsuario(usuario);
      } catch (error) {
        console.error("Error agregando usuario nuevo:", error);
      }
    }

  return (
    <>
      <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      >
        <ModalUsuario
        abrir={abrirModalUsuario}
        cerrarModal={() => setAbrirModalUsuario(false)}
        onSubmit={(dato) => {
          GuardarUsuario(dato)
          setAbrirModalUsuario(false);
        }}
        origen={OrigenUsuario.LOGIN}
        usuarioEditar={-1}
      />
        <Box 
          component="form"
          onSubmit={handleLogin} 
          sx={{
            width: "50vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: colors.primary[500],
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            opacity: 0.97
          }}
        >
          <Typography 
            variant="h2" 
            textAlign="center" 
            color={colors.grey[100]}
            fontWeight="bold"
            mb="15px"
          >
            Iniciar Sesión
          </Typography>
          <Box
            display="flex" 
            backgroundColor = {colors.primary[400]}
            borderRadius= "10px"
            height="35px"
          >
            <InputBase 
            type='text' 
            sx= {{ml : 2, flex: 1}} 
            placeholder="Nombre de usuario" 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required/>
            <Box display="flex" alignItems="center" mr="5px">
              <AccountCircleOutlinedIcon/>
            </Box>
          </Box>
          <Box
            display="flex" 
            backgroundColor = {colors.primary[400]}
            borderRadius= "10px"
            height="35px"
          >
            <InputBase 
            type='password' 
            sx= {{ml : 2, flex: 1}} 
            placeholder="Contraseña" 
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required/>
            <Box display="flex" alignItems="center" mr="5px">
              <LockOutlinedIcon/>
            </Box>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            fontSize="0.9rem"
            color={colors.grey[100]}
          >
            {/* 
            <label>
              <input type="checkbox" /> Recuerda nombre de usuario
            </label>
            */}
            <a href="#" style={{ color: colors.greenAccent[400] }}>¿Olvidaste la contraseña?</a>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.grey[100],
              ":hover": { backgroundColor: colors.greenAccent[800] },
            }}
          >
            Iniciar sesión
          </Button>

          <Typography textAlign="center" color="white" fontSize="0.9rem">
            <>¿No tienes una cuenta? </>
            <span onClick={() => setAbrirModalUsuario(true)} 
            style={{color: colors.greenAccent[400],  textDecoration: "underline", cursor: "pointer"}}
            >
              Regístrate
            </span>
          </Typography>
        </Box>
      </Box>
      <Backdrop
        open = {abrirModal}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter:"blur(5px)"
        }}
      >
        <Dialog
          open = {abrirModal}
          onClose={handleCerrarModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "bold" }}>
            {"No se pudo iniciar sesión"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {mensajeError}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
            onClick={handleCerrarModal} 
            autoFocus
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              ":hover": { backgroundColor: colors.greenAccent[700] },
            }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </>
  );
};

export default LoginForm;