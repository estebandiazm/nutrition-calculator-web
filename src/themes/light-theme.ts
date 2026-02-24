import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1E3A8A", // Deep Navy
      light: "#3B82F6",
      dark: "#1E40AF",
    },
    secondary: {
      main: "#0EA5E9", // Sky/Cyan/Cyan
    },
    background: {
      default: "#f8fafc",
      paper: "rgba(255, 255, 255, 0.85)", 
    }
  },
  typography: {
    fontFamily: '"Geist", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed",
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
          color: "#1E293B",
          height: 60,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 700,
          color: "#0F172A",
        },
        h2: {
          fontSize: 22,
          fontWeight: 600,
          color: "#1E293B",
        },
        h5: {
          fontWeight: 600,
          color: "#1E3A8A",
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
          color: "#334155",
        },
        body1: {
          color: "#475569",
        }
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "medium",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          fontWeight: 600,
          border: 0,
          padding: "8px 24px",
          ":hover": {
            transition: "all 0.2s ease-in-out",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
          color: "white",
          boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
          ":hover": {
            background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.23)",
          }
        },
        outlined: {
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(4px)",
          color: "#1E3A8A",
          border: "2px solid #1E3A8A !important",
          ":hover": {
            background: "rgba(30, 58, 138, 0.04)",
            border: "2px solid #1E40AF !important",
          }
        }
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "16px",
          border: "1px solid rgba(59, 130, 246, 0.3)",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px !important",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          "&:before": {
             display: "none",
          },
        },
      }
    }
  },
});
