import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import React from "react";

const Menu = () => {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(10, 22, 40, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #7C9FFF 0%, #E91E8C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Calculadora Nutricional
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from hiding under the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Menu;
