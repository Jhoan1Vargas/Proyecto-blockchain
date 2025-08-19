import { 
  Dialog, DialogTitle, DialogContent, TextField, Button, useTheme, Box, Typography, 
  FormControl,  InputLabel,  Select,  MenuItem, InputAdornment, IconButton
} 
from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { obtenerRoles } from "../services/authService";
import { Roles, OrigenUsuario } from "../data/constantes"

const ModalUsuario = ({ abrir, cerrarModal, onSubmit, usuarioEditar, origen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showclave, setShowclave] = useState(false);
  const [roles, setRoles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    idUser: 0,
    userName: "",
    clave: "",
    correo: "",
    idRol: "",
    estado: "A",
  });

  const [controles, setControles] = useState({
    userNameVisible: true,
    userNameHabilitado: true,
    claveVisible: true,
    claveHabilitado: true,
    correoVisible: true,
    correoHabilitado: true,
    idRolVisible: true,
    idRolHabilitado: true,
    estadoVisible: true,
    estadoHabilidato: true,
  });

  const ajustarControles = (origen) => {
    setInitialValues( 
    {
      idUser: 0,
      userName: "",
      clave: "",
      correo: "",
      idRol: "",
      estado: "A",
    });

    if (origen === OrigenUsuario.USUARIO_NUEVO){
      setControles({
        userNameVisible: true,
        userNameHabilitado: true,
        claveVisible: true,
        claveHabilitado: true,
        correoVisible: true,
        correoHabilitado: true,
        idRolVisible: true,
        idRolHabilitado: true,
        estadoVisible: true,
        estadoHabilidato: true,
      });
    }

    if (origen === OrigenUsuario.USUARIO_EDITAR){
      setControles({
        userNameVisible: true,
        userNameHabilitado: true,
        claveVisible: false,
        claveHabilitado: false,
        correoVisible: true,
        correoHabilitado: true,
        idRolVisible: true,
        idRolHabilitado: true,
        estadoVisible: false,
        estadoHabilidato: false,
      });

    }

    if (origen === OrigenUsuario.LOGIN){
      setControles({
        userNameVisible: true,
        userNameHabilitado: true,
        claveVisible: true,
        claveHabilitado: true,
        correoVisible: true,
        correoHabilitado: true,
        idRolVisible: false,
        idRolHabilitado: false,
        estadoVisible: false,
        estadoHabilidato: false,
      });

      setInitialValues({
        idUser: 0,
        userName: "",
        clave: "",
        correo: "",
        idRol: Roles.USER,
        estado: "A",
      });
    }
  }

  const cargarRoles =  async () => {
    try 
    {
      const respuesta = await obtenerRoles();
      setRoles(respuesta.roles);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  const cargarDatosUsuario = (usuarioEditar) => {
    if (usuarioEditar.id > 0) {
      setInitialValues({
        idUser: usuarioEditar.id,
        userName: usuarioEditar.nombre,
        clave: usuarioEditar.clave,
        correo: usuarioEditar.correo,
        idRol: usuarioEditar.idrol,
        estado: usuarioEditar.estado,
      });
    }
  }

  useEffect(() => {
    if (abrir){
      cargarRoles();
      setShowclave(false);
      ajustarControles(origen)
      if (usuarioEditar.id > 0) cargarDatosUsuario(usuarioEditar);
    }
  }, [abrir, origen, usuarioEditar]);

  return(
    <Dialog
      open={abrir}
      maxWidth = "sm"
      onClose={cerrarModal}
      fullWidth
      slotProps ={{
        backdrop: {
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: colors.grey[800],
        color: colors.grey[100],
        fontWeight: "bold",
        fontSize: "26px"
      }}>
        {usuarioEditar.id > 0 ? "Modificar Usuario" : "Crear Usuario"}
      </DialogTitle>
      <DialogContent sx={{backgroundColor: colors.grey[800]}}>
        <Formik
          onSubmit={onSubmit}
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                {controles.userNameVisible && <TextField
                  fullWidth
                  variant="filled"
                  disabled = {!controles.userNameHabilitado}
                  type="text"
                  label="Usuario"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={!!touched.userName && !!errors.userName}
                  helperText={touched.userName && errors.userName}
                  sx={{ 
                    gridColumn: controles.claveVisible ? "span 2" : "span 4",
                    '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                      },
                      '&:before': {
                        borderBottomColor: !!touched.userName && !!errors.userName ? colors.blueAccent[300]: colors.grey[600], // <-- color por defecto (antes del focus)
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.userName && !!errors.userName ? colors.blueAccent[300]: colors.grey[400], // <-- hover
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.userName ? colors.grey[300]: colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.userName && errors.userName
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                        font:"bold",
                    },
                  }}
                />
                }
                {controles.claveVisible && <TextField
                  fullWidth
                  variant="filled"
                  disabled = {!controles.claveHabilitado}
                  type={showclave ? 'text' : 'password'}
                  label="Contraseña"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.clave}
                  name="clave"
                  error={!!touched.clave && !!errors.clave}
                  helperText={touched.clave && errors.clave}
                  sx={{ 
                    gridColumn: "span 2",
                    '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                      },
                      '&:before': {
                        borderBottomColor: !!touched.clave && !!errors.clave ? colors.blueAccent[300]: colors.grey[600], // <-- color por defecto (antes del focus)
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.clave && !!errors.clave ? colors.blueAccent[300]: colors.grey[400], // <-- hover
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.clave ? colors.grey[300]: colors.grey[100],
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.clave && errors.clave
                        ? colors.blueAccent[300]  
                        : colors.grey[300],      
                    }
                  }}
                  slotProps={{
                    input:{
                      endAdornment: (
                        controles.claveHabilitado && 
                        <InputAdornment position="end">
                          <IconButton onClick={() => {setShowclave((prev) => !prev)}} edge="end">
                            {showclave ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />
                }
                {controles.idRolHabilitado && <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ 
                    gridColumn: "span 4", 
                    '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], 
                      },
                      '&:before': {
                        borderBottomColor: !!touched.idRol && !!errors.idRol ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.idRol && !!errors.idRol ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.idRol ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.idRol && errors.idRol
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                    },
                  }}
                >
                  <InputLabel id="idRol-label">Nivel de Usuario</InputLabel>
                  <Select
                    labelId="idRol-label"
                    id="idRol"
                    name="idRol"
                    value={values.idRol}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {roles.map((rol) => (
                      <MenuItem key = {rol.Id} value = {rol.Id}>
                        {rol.Nombre}
                      </MenuItem>
                    ))}
                      
                    {roles.length === 0 && (
                      <MenuItem disabled value="">
                        Cargando roles...
                      </MenuItem>
                    )}
                  </Select>
                  {touched.idRol && errors.idRol && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.blueAccent[300],
                      marginTop: "5px",
                      marginLeft: "14px"
                    }}
                  >
                    {errors.idRol}
                  </Typography>
                )}
                </FormControl>
                }

                {controles.correoVisible && <TextField
                  fullWidth
                  disabled={!controles.correoHabilitado}
                  variant="filled"
                  type="text"
                  label="Correo Electrónico"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.correo}
                  name="correo"
                  error={!!touched.correo && !!errors.correo}
                  helperText={touched.correo && errors.correo}
                  sx={{ 
                    gridColumn: "span 4",
                    '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], // <-- cambiar color de error
                      },
                      '&:before': {
                        borderBottomColor: !!touched.correo && !!errors.correo ? colors.blueAccent[300]: colors.grey[600], // <-- color por defecto (antes del focus)
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.correo && !!errors.correo ? colors.blueAccent[300]: colors.grey[400], // <-- hover
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.userName ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.correo && errors.correo
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                    },
                  }}
                />
                }

                {controles.estadoHabilidato && <FormControl
                  fullWidth
                  disabled={!controles.estadoVisible}
                  variant="filled"
                  sx={{ 
                    gridColumn: "span 4", 
                    '& .MuiFilledInput-root': {
                      color: colors.grey[100],
                      '&:after': {
                        borderBottomColor: colors.blueAccent[300], 
                      },
                      '&:before': {
                        borderBottomColor: !!touched.estado && !!errors.estado ? colors.blueAccent[300] : colors.grey[600],
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: !!touched.estado && !!errors.estado ? colors.blueAccent[300] : colors.grey[400], 
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: values.estado ? colors.grey[300] : colors.grey[100] ,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.grey[300] ,
                    },
                    "& .MuiFormHelperText-root": {
                      color: touched.estado && errors.estado
                        ? colors.blueAccent[300]  // Si hay error
                        : colors.grey[300],      // Si no hay error
                    },
                  }}
                >
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    id="estado"
                    name="estado"
                    value={values.estado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem key = "A" value = "A"> Activo </MenuItem>
                    <MenuItem key = "I" value = "I"> Inactivo </MenuItem>
                  </Select>
                  {touched.estado && errors.estado && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.blueAccent[300],
                      marginTop: "5px",
                      marginLeft: "14px"
                    }}
                  >
                    {errors.estado}
                  </Typography>
                  )}
                </FormControl>
                }

              </Box>
              <Box display="flex" justifyContent="flex-end" width="100%" mt="20px" gap="10px">
                <Button type="submit" variant="contained"
                  sx={{
                    minWidth: "25%",
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[100],
                    ":hover":{backgroundColor:colors.greenAccent[800]}
                  }}
                >
                  Guardar
                </Button>
                <Button type="button" variant="contained" 
                  sx={{
                    minWidth: "25%",
                    backgroundColor: colors.redAccent[600],
                    color: colors.grey[100],
                    ":hover":{backgroundColor:colors.redAccent[700]}
                  }}
                  onClick={cerrarModal}
                >
                  Salir
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const checkoutSchema = yup.object().shape({
  userName: yup.string().trim().required("Campo Requerido"),
  clave: yup.string().trim().required("Campo Requerido"),
  correo: yup.string().trim().email("Email no válido").required("Campo requerido"),
  idRol: yup.number().required("Campo Requerido"),
  estado: yup.string().trim().required("Campo Requerido"),
});

export default ModalUsuario;