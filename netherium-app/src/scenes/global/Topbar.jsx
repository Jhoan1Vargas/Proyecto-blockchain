import { Box, IconButton, useTheme, Menu, MenuItem} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutLinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutLinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../components/SearchContext"


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const { setTextoBusqueda } = useContext(SearchContext);

  const handleChange = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const handleAbrirMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCerrarMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    handleCerrarMenu();
    navigate("/");
  };

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
        <IconButton>
          <NotificationsOutlinedIcon/>
        </IconButton>
        <IconButton>
          <PersonOutLinedIcon/>
        </IconButton>
        <IconButton onClick={handleAbrirMenu}>
          <SettingsOutLinedIcon/>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCerrarMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Salir</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Topbar;