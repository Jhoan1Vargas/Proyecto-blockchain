import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./scenes/dashboard";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import LoginForm from "./scenes/loginForm/LoginForm";
import Team from "./scenes/team/Team";
import Wallet from "./scenes/wallet/wallet";
import Compra from "./scenes/compra/Compra";
import Venta from "./scenes/venta/Venta";
import Transferencia from "./scenes/transferencia/Transferencia";
import Transacciones from "./scenes/transacciones/Transacciones";


function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return(
    <ColorModeContext.Provider value = {colorMode}>
      <ThemeProvider theme = {theme}>
        <CssBaseline/>
        <div className="app">
          { !isLoginPage &&
          <Sidebar/>
          }
          <main className={isLoginPage ? "content-login" :"content"}>
            {! isLoginPage && <Topbar/>}
            <Routes>
              <Route path="/" element ={<LoginForm/>}/>
              <Route path="/dashboard" element ={<Dashboard/>}/>
              <Route path="/team" element ={<Team abrirForm={true}/>}/>
              <Route path="/wallet" element ={<Wallet abrirForm={true}/>}/>
              <Route path="/compra" element ={<Compra abrirForm={true}/>}/>
              <Route path="/venta" element ={<Venta abrirForm={true}/>}/>
              <Route path="/transacciones" element ={<Transacciones/>}/>
              <Route path="/transferencia/propias" element ={<Transferencia abrirForm={true} usarWalletPropias={true}/>}/>
              <Route path="/transferencia" element ={<Transferencia abrirForm={true} usarWalletPropias={false}/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
