import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ThemeProvider, useTheme } from "@mui/material";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Account } from "./components/Account";

function App() {
  const theme = useTheme();
  theme.palette.primary.main = "#33AA66";
  theme.palette.primary.dark = "#006633";
  theme.palette.primary.light = "#66FF77";
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/register" Component={Register} />
          <Route path="/login" Component={Login} />
          <Route path="/account" Component={Account} />
          <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
