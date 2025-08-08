import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");

  return (
    <SearchContext.Provider value={{ textoBusqueda, setTextoBusqueda }}>
      {children}
    </SearchContext.Provider>
  );
};