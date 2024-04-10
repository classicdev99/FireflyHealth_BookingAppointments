import React from "react";
import { AppBar, Box, CssBaseline } from "@mui/material";
import Divider from "@mui/material/Divider";
import logo from "./logo.svg";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";

export const Root: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky"
        sx={{
          boxShadow: "none",
          backgroundColor: "white"
        }}
      >
        <Box m={2} mb={1.75}>
          <img src={logo} alt="Logo" height={30} />
        </Box>
      </AppBar>
      <Divider
        sx={{
          backgroundColor: "#e0e0e0",
          height: 2,
        }}
      />
      <Box m={2} mt={0}>
        {
          // if the user is on the appointments page, show the sidebar
          location.pathname.includes("appointments") ?
            <Box minHeight={"92vh"} display={"flex"} flexDirection={"row"}>
              <Sidebar />
              <Divider orientation={"vertical"} flexItem sx={{
                backgroundColor: "#e0e0e0",
                width: 2,
              }} />
              <Outlet />
            </Box> :
            <Outlet />
        }
      </Box>
    </>
  );
};

export default Root;
