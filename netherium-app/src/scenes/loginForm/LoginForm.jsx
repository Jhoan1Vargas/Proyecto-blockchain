import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Box, Button, Typography, useTheme} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { InputBase } from '@mui/material';
import { login } from "../../services/authService";

const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultado = await login(correo,clave);

    if (resultado.esValido) {
      console.log("Login exitoso")
      navigate("/dashboard");
    } else {
      console.log("Login fallido\n" + resultado.error)
    }
  };

  return (
    <Box 
    display="flex"
    justifyContent="center"
    alignItems="center"
    >
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
          justifyContent="space-between"
          fontSize="0.9rem"
          color={colors.grey[100]}
        >
          <label>
            <input type="checkbox" /> Recuerda nombre de usuario
          </label>
          <a href="#" style={{ color: colors.greenAccent[400] }}>¿Olvidaste la contraseña?</a>
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            ":hover": { backgroundColor: colors.greenAccent[700] },
          }}
        >
          Iniciar sesión
        </Button>

        <Typography textAlign="center" color="white" fontSize="0.9rem">
          ¿No tienes una cuenta? <a href="#" style={{ color: colors.greenAccent[400] }}>Regístrate</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;