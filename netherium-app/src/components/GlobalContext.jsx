import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [usuarioActual, setUsuarioActual] = useState(null);

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
