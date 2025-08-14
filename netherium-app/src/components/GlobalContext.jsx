import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [usuarioActual, setUsuarioActual] = useState({
        Id: 0,
        nombre: "", 
        clave: "", 
        correo: "", 
        idrol: 0, 
        estado: "A",
      });

  return (
    <GlobalContext.Provider
      value={{
        textoBusqueda,
        setTextoBusqueda,
        usuarioActual,
        setUsuarioActual,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
