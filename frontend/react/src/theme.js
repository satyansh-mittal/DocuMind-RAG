// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { padding: "1rem", borderRadius: "8px" },
      },
    },
  },
});

export default theme;
