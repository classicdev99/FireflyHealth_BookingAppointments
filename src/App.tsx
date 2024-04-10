import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, deepOrange } from "@mui/material/colors";

import { Root } from "./Root";
import { Intro } from "./routes/index";
import { AppointmentsIndex } from "./routes/appointments/index";
import { AppointmentsNew } from "./routes/appointments/new";
import { DataProvider } from "./hooks/useData";

const THEME = createTheme({
  palette: {
    primary: { ...blue, main: blue["700"] },
    secondary: deepOrange,
  },
});

export const App: React.FC = () => (
  <ThemeProvider theme={THEME}>
    <BrowserRouter>
      <DataProvider> 
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Intro />} />
            <Route path="/appointments" element={<AppointmentsIndex />} />
            <Route path="/appointments/new" element={<AppointmentsNew />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
