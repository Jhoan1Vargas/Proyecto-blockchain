export const Roles = Object.freeze({
  ADMIN: 1,
  USER: 2,
});

export const NombrarRol = (idRol) =>{
  if (idRol === Roles.ADMIN)  return "Administrador";
  if (idRol === Roles.USER) return "Usuario";
}

export const OrigenUsuario = Object.freeze({
  USUARIO_NUEVO: 1,
  USUARIO_EDITAR: 2,
  LOGIN: 3,
});

