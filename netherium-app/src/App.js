import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./scenes/dashboard";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import LoginForm from "./scenes/loginForm/LoginForm";
import Team from "./scenes/team/team";
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";
// import Bar from "./scenes/bar";
import Form from "./scenes/form";
import { useState } from "react";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";



function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const [iduser, setIdUser] = useState(0)
  const [username, setUsername] = useState("")
  const [userrol, setUserrol] = useState("")

  return(
    <ColorModeContext.Provider value = {colorMode}>
      <ThemeProvider theme = {theme}>
        <CssBaseline/>
        <div className="app">
          { !isLoginPage &&
          <Sidebar username={username} userrol={userrol}/>
          }
          <main className={isLoginPage ? "content-login" :"content"}>
            {! isLoginPage && <Topbar/>}
            <Routes>
              <Route path="/" element ={<LoginForm setIdUser={setIdUser} setUsername={setUsername} setUserrol={setUserrol}/>}/>
              <Route path="/dashboard" element ={<Dashboard/>}/>
              <Route path="/team" element ={<Team abrirForm={true}/>}/>
              {/*<Route path="/contacts" element  ={<Contacts/>}/>*/}
              {/* <Route path="/invoices" element  ={<Invoices/>}/> */}
              <Route path="/form" element ={<Form/>}/>
              {/* <Route path="/bar" element  ={<Bar/>}/> */}
              {/* <Route path="/pie" element  ={<Pie/>}/> */}
              {/* <Route path="/line" element  ={<Line/>}/> */}
              {/* <Route path="/faq" element  ={<FAQ/>}/> */}
              {/* <Route path="/geography" element  ={<Geography/>}/> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
