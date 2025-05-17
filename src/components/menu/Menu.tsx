import ThemeProvider from "@mui/system/ThemeProvider";
import { lightTheme } from "../../themes";
import { Typography } from "@mui/material";
import React from "react";

const Menu = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Typography
        variant="h1"
        component="h1"
        sx={{ p: 2, color: "secondary.main", backgroundColor: "primary.main" }}
      >
        Calculadora Nutricional
      </Typography>
    </ThemeProvider>
  );
};

export default Menu;
