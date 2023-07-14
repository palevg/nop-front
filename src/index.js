import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { AuthContextProvider } from './context/authContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ThemeProvider>
);