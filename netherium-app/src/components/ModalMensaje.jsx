import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useTheme,
} 
from "@mui/material";
import { tokens } from "../theme";


const ModalMensaje = ({ abrir, cerrarModal, titulo, mensaje }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return(
    <Dialog
      open={abrir}
      maxWidth = "sm"
      onClose={cerrarModal}
      fullWidth
      slotProps ={{
        backdrop: {
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: colors.grey[800],
        color: colors.grey[100],
        fontWeight: "bold",
        fontSize: "26px"
      }}>
        {titulo}
      </DialogTitle>
      <DialogContent sx={{backgroundColor: colors.grey[800]}}>
        <DialogContentText id="alert-dialog-description">
          {mensaje}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.grey[800]}}>
        <Button 
        autoFocus
        onClick={cerrarModal}
        sx={{
          backgroundColor: colors.greenAccent[700],
          color: colors.grey[100],
          ":hover": { backgroundColor: colors.greenAccent[800] },
        }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default ModalMensaje;