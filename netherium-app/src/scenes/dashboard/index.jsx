import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { consultarTransaccion } from "../../services/transService";
import { obtenerUsuarios} from "../../services/authService";
import { useState, useEffect } from 'react';
import { format } from 'date-fns'


const Dashboard = () => {
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [transacciones, setTransacciones] = useState([]);
const [usuarios, setUsuarios] = useState([]);

const CargarTransacciones = async () => {
    try {
            const data = await consultarTransaccion();
            setTransacciones(data.transacciones);
        } catch (error) {
            console.error("Error cargando transacciones:", error);
        }
}

const CargarUsuario = async () => {
    try {
        const data = await obtenerUsuarios();
        setUsuarios(data.usuarios);
        } catch (error) {
        console.error("Error cargando usuarios:", error);
        }
}
useEffect(() => {
    CargarTransacciones();
    CargarUsuario();
}, []);


return (
<Box m="20px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenido al Dashboard" />
        <Box>
            <Button
            sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
            }}
            >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Descargar Reportes
            </Button>
        </Box> 
    </Box>
    {/* GRAFICOS */}
    <Box
    display="grid"
    gridTemplateColumns="repeat(12, 1fr)"
    gridAutoRows="140px"
    gap="20px"
    >
    {/* ROW 1 */}
    {/* <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title="12,361"
        subtitle="Correos Enviados"
        progress="0.75"
        increase="+14%"
        icon={
            <EmailIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box> */}
    <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title={Number(transacciones.filter(t => t.Tipo === 'C').length).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 0,})}
        subtitle="Compras Realizadas"
        progress={transacciones.filter(t => t.Tipo === 'C').length/(transacciones.length ? transacciones.length : 1)}
        increase={`${
            Number((transacciones.filter(t => t.Tipo === 'C').length/(transacciones.length ? transacciones.length : 1)) * 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,})
        }%`}
        icon={
            <PointOfSaleIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box>
    <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title={Number(transacciones.filter(t => t.Tipo === 'V').length).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 0,})}
        subtitle="Ventas Realizadas"
        progress={transacciones.filter(t => t.Tipo === 'V').length/(transacciones.length ? transacciones.length : 1)}
        increase={`${
            Number((transacciones.filter(t => t.Tipo === 'V').length/(transacciones.length ? transacciones.length : 1)) * 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,})
        }%`}
        icon={
            <SellOutlinedIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box>
    <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title={Number(transacciones.filter(t => t.Tipo === 'T').length).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 0,})}
        subtitle="Transferencias Realizadas"
        progress={transacciones.filter(t => t.Tipo === 'T').length/(transacciones.length ? transacciones.length : 1)}
        increase={`${
            Number((transacciones.filter(t => t.Tipo === 'T').length/(transacciones.length ? transacciones.length : 1)) * 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,})
        }%`}
        icon={
            <CurrencyExchangeOutlinedIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box>
    <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title={Number(usuarios.filter(u => u.Estado === 'A').length).toLocaleString(undefined,{minimumFractionDigits: 0, maximumFractionDigits: 0,})}
        subtitle="Usuarios Activos"
        progress={usuarios.filter(u => u.Estado === 'A').length/(usuarios.length ? usuarios.length : 1)}
        increase={`${
            Number((usuarios.filter(u => u.Estado === 'A').length/(usuarios.length ? usuarios.length : 1)) * 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,})
        }%`}
        icon={
            <PersonAddIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box>
    {/* <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <StatBox
        title="1,325,134"
        subtitle="Tráfico Recibido"
        progress="0.80"
        increase="+43%"
        icon={
            <TrafficIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
        }
        />
    </Box> */}

    {/* ROW 2 */}
    {/* <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
    >
        <Box
        mt="25px"
        p="0 30px"
        display="flex "
        justifyContent="space-between"
        alignItems="center"
        >
        <Box>
            <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            >
            Ganancias Generadas
            </Typography>
            <Typography
            variant="h3"
            fontWeight="bold"
            color={colors.greenAccent[500]}
            >
            $59,342.32
            </Typography>
        </Box>
        <Box>
            <IconButton>
            <DownloadOutlinedIcon
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
            />
            </IconButton>
        </Box>
        </Box>
        <Box height="250px" m="-20px 0 0 0">
        <LineChart isDashboard={true} />
        </Box>
    </Box> */}
    <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        overflow="auto"
    >
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        colors={colors.grey[100]}
        p="15px"
        >
        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Transacciones Recientes
        </Typography>
        </Box>
        {transacciones.sort((a, b) => b.Id - a.Id).map((transaction) => (
        <Box
            key={`${transaction.Id}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
        >
            <Box> 
            <Typography
                color={colors.greenAccent[500]}
                variant="h4"
                fontWeight="600"
            >
                {transaction.Tipo === "C" && "Compra"}
                {transaction.Tipo === "T" && "Transferencia"}
                {transaction.Tipo === "V" && "Venta"}
            </Typography>
            <Typography
                color={colors.blueAccent[400]}
                variant="h5"
                fontWeight="600"
            >
                {transaction.HashTx}
            </Typography>
            <Typography color={colors.grey[100]}>
                <b>Usuario Origen:</b> {transaction.NombreUsuarioOrigen}
            </Typography>
            <Typography color={colors.grey[100]}>
                <b>Wallet Origen:</b> {transaction.DireccionWalletOrigen}
            </Typography>
            <Typography color={colors.grey[100]}>
                <b>Usuario Destino:</b> {transaction.NombreUsuarioDestino}
            </Typography>
            <Typography color={colors.grey[100]}>
                <b>Wallet Destino:</b> {transaction.DireccionWalletDestino}
            </Typography>
            </Box>
            <Box color={colors.grey[100]}>
                {format(transaction.FechaCreacion.replace("Z",""), "dd/MM/yyyy hh:mm:ss a")}
            </Box>
            <Box
            backgroundColor={colors.greenAccent[600]}
            p="5px 10px"
            borderRadius="4px"
            >
            {Number(transaction.Monto).toLocaleString(undefined,{
            minimumFractionDigits: 18,
            maximumFractionDigits: 18,
            })} ETH
            </Box>
        </Box>
        ))}
    </Box>

    {/* ROW 3 */}
    {/* <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        p="30px"
    >
        <Typography variant="h5" fontWeight="600">
        Campaign
        </Typography>
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt="25px"
        >
        <ProgressCircle size="125" />
        <Typography
            variant="h5"
            color={colors.greenAccent[500]}
            sx={{ mt: "15px" }}
        >
            $48,352 revenue generated
        </Typography>
        <Typography>Includes extra misc expenditures and costs</Typography>
        </Box>
    </Box> */}
    {/* <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
    >
        <Typography
        variant="h5"
        fontWeight="600"
        sx={{ padding: "30px 30px 0 30px" }}
        >
        Cantidad de Ventas
        </Typography>
        <Box height="250px" mt="-20px">
        <BarChart isDashboard={true} />
        </Box>
    </Box> */}
    {/* <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        padding="30px"
    >
        <Typography
        variant="h5"
        fontWeight="600"
        sx={{ marginBottom: "15px" }}
        >
        Tráfico Geográfico
        </Typography>
        <Box height="200px">
        <GeographyChart isDashboard={true} />
        </Box>
    </Box> */}
    </Box>
</Box>
);
};

export default Dashboard;