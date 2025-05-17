import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { lightTheme } from "../../themes";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { ClientContext } from "../../context/ClientContext";
import { ClientContextType } from "../../model/ClientContextType";
import { firstMeal, fruits, secondMeal } from "../../adapters/GetFood";
import FoodList from "../food-list/FoodList";
import { Food } from "../../model/Food";
import { AccountCircle, MonitorWeightRounded } from "@mui/icons-material";
import Menu from "../menu/Menu";

const Creator = () => {
  const navigate = useNavigate();

  const { saveClient } = useContext(ClientContext) as ClientContextType;

  const [data, setData] = useState({
    name: "",
    fruits: [] as Food[],
    firstMeal: [] as Food[],
    secondMeal: [] as Food[],
  });

  const saveHandler = () => {
    saveClient({
      name: data.name,
      plan: {
        fruits: fruits,
        firstMeal: firstMeal,
        secondMeal: secondMeal,
      },
    });
    navigate("/viewer");
  };

  const updateFruitHandler = (foods: Food[]) => {
    setData({ ...data, fruits: foods });
  };
  const updateFirstMealHandler = (foods: Food[]) => {
    setData({ ...data, firstMeal: foods });
  };

  const updateSecondMealHandler = (foods: Food[]) => {
    setData({ ...data, secondMeal: foods });
  };

  const storeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: event.target.value });
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Menu />
      <Grid container spacing={2} sx={{ m: 2 }}>
        <Grid size={{ xs: 12, sm: 12, md: 10 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="full-name"
              label="Nombre"
              variant="standard"
              onChange={storeName}
              sx={{ width: "100%" }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 2, md: 2 }}>
          <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
            <MonitorWeightRounded
              sx={{ color: "action.active", mr: 1, my: 0.5 }}
            />
            <TextField
              id="body-weight"
              label="Peso"
              variant="standard"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">Kg</InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Frutas"
            foods={fruits}
            handler={updateFruitHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Primera Comida"
            foods={firstMeal}
            handler={updateFirstMealHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Proteinas"
            foods={secondMeal.filter((food) => food.category === "BASE")}
            handler={updateSecondMealHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Carbohidratos"
            foods={secondMeal.filter((food) => food.category === "COMPLEMENT")}
            handler={updateSecondMealHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Button
            variant="contained"
            onClick={saveHandler}
            sx={{ width: "100%", height: "3em" }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Creator;
