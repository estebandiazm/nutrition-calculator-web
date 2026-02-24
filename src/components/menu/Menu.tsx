import ThemeProvider from "@mui/system/ThemeProvider";
import { lightTheme } from "../../themes";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import React from "react";

const Menu = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppBar position="fixed" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography 
              variant="h5" 
              component="div"
              sx={{ 
                fontWeight: 800, 
                background: "linear-gradient(90deg, #1E3A8A 0%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Calculadora Nutricional
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from hiding under the fixed AppBar */}
      <Toolbar />
    </ThemeProvider>
  );
};

export default Menu;
