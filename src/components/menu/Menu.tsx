import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { NoteAdd } from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import { LogoutButton } from "@/components/ui/LogoutButton";

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
            <Link href="/" style={{ textDecoration: "none" }}>
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
            </Link>
          </Box>
          <Link href="/creator" passHref style={{ textDecoration: "none" }}>
            <Button
              startIcon={<NoteAdd />}
              sx={{
                color: "rgba(255,255,255,0.7)",
                textTransform: "none",
                fontWeight: 600,
                mr: 1,
                "&:hover": { color: "#7C9FFF" },
              }}
            >
              Crear Plan
            </Button>
          </Link>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from hiding under the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Menu;
