import { createTheme } from "@mui/material/styles";
import { ukUA } from '@mui/x-date-pickers/locales';

export const theme = createTheme({
  ukUA,
  mode: "light",
  // shadows: [1,2,4,8],
  palette: {
    primary: {
      main: "#5d88e7",
      edit: "#FFFFE0"
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
