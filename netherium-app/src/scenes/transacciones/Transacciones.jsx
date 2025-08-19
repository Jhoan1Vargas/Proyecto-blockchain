import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import Header from "../../components/Header";

const Transacciones = () => {

const Item = ({ title, to, icon, }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      gridColumn="span 6"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      borderRadius="12px"
      sx={{ boxShadow: 3 }}
    >
      {/* Ícono */}
      <Box fontSize="2rem" display="flex" mb={1} padding={3} sx={{backgroundColor: colors.blueAccent[600], borderRadius: "80%"}}>
        {icon}
      </Box>

      {/* Título */}
      <Typography variant="h3" gutterBottom fontWeight="bold">
        {title}
      </Typography>

      {/* Botón que navega */}
      <Button
        variant="contained"
        component={Link}
        to={to}
        sx={{
          backgroundColor: colors.greenAccent[600],
          "&:hover":{
            backgroundColor: colors.greenAccent[700],
          }
        }}
      >
        <Typography variant="h5" color={colors.grey[100]} fontWeight="bold">
          Ir
        </Typography>
      </Button>
    </Box>
  );
};

return (
<Box m="20px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Menú de Transacciones" subtitle="Tipos de Transacciones disponibles" />
    </Box>
    {/* GRAFICOS */}
    <Box
    display="grid"
    gridTemplateColumns="repeat(12, 1fr)"
    gridAutoRows="140px"
    gap="20px"
    >
    {/* ROW 1 */}
    <Item
      title="Realizar Compra de Ethereum"
      to="/compra"
      icon={<PointOfSaleIcon sx={{fontSize: 60}} />}
    />
    <Item
      title="Realizar Venta de Ethereum"
      to="/venta"
      icon={<SellOutlinedIcon sx={{fontSize: 60}} />}
    />
    <Item
      title="Realizar Transferencia de Ethereum con Wallets de Terceros"
      to="/transferencia"
      icon={<WalletOutlinedIcon sx={{fontSize: 60}} />}
    />
    <Item
      title="Realizar Transferencia de Ethereum con Wallets Propias"
      to="/transferencia/propias"
      icon={<CurrencyExchangeOutlinedIcon sx={{fontSize: 60}} />}
    />
    </Box>
</Box>
);
};

export default Transacciones;