import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { Divider } from "@mui/material"
import { GlobalContext } from "../../components/GlobalContext"
import { NombrarRol } from "../../data/constantes"


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { usuarioActual } = useContext(GlobalContext);


  return (
    <Box
      sx = {{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" ml="15px">
                <Typography variant="h4" color={colors.grey[100]}>
                  NETHEREUM
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon/>
                </IconButton>
              </Box>
            )}
          </MenuItem>


            {/* USER */}
            {!isCollapsed && (
              <Box mb="25 px">
                {/*
                <Box display="flex" justifyContent="center" alignContent="center">
                  <img 
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`.../../assets/user.png`}
                    style={{cursor: "pointer", borderRadius:"50%"}}
                  />
                </Box>
                */}
                <Box textAlign="center"> 
                  <Typography 
                    variant="h3" 
                    color={colors.grey[100]} 
                    fontWeight="bold" 
                    sx={{ m: "10px 0 0 0" }}>{!!!usuarioActual ?  "": usuarioActual.Nombre }</Typography>
                  <Typography 
                    variant="h6" 
                    color={colors.greenAccent[500]}
                  >{NombrarRol(!!!usuarioActual ? "" : usuarioActual.idRol)}</Typography>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2, borderColor: colors.grey[100] }} />

            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                color={colors.grey[200]}

                sx= {isCollapsed ? {m:"15px 0 5px 10px"} : {m:"15px 0 5px 20px"}}
              >
                Registros
              </Typography>

              {usuarioActual.idRol === 1 &&
              <Item
              title="Usuarios"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              />
              }

              {/* <Item
              title="Mi Perfil"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

              <Item
              title="Wallet"
              to="/wallet"
              icon={<AccountBalanceWalletOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[200]}
              sx= {isCollapsed ? {m:"15px 0 5px 15px"} : {m:"15px 0 5px 20px"}}
            >
              Procesos
            </Typography>

            <Item
              title="Transacciones"
              to="/transacciones"
              icon={<PaidOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[200]}
              sx= {isCollapsed ? {m:"15px 0 5px 15px"} : {m:"15px 0 5px 20px"}}
            >
              Reportes
            </Typography>
            
            <Item
              title="Recibos"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Gráfico de Barras"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gráfico Pastel"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Gráfico de Líneas"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gráfico Geográfico"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}

export default Sidebar;