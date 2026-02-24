'use client'

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { lightTheme } from "../../themes";
import React, { useContext, useState } from "react";
import { ClientContext } from "../../context/ClientContext";
import { ClientContextType } from "../../context/ClientContextType";
import { FoodDatabase } from "../../domain/services/FoodDatabase";
import { DietEngine } from "../../domain/services/DietEngine";
import FoodList from "../food-list/FoodList";
import { Food } from "../../domain/types/Food";
import { AccountCircle, MonitorWeightRounded } from "@mui/icons-material";
import Menu from "../menu/Menu";
import { useRouter } from "next/navigation";

const Creator = () => {
  const router = useRouter();

  const { saveClient } = useContext(ClientContext) as ClientContextType;

  const [data, setData] = useState({
    name: "",
    fruits: [] as Food[],
    firstMeal: [] as Food[],
    secondMealBase: [] as Food[],
    secondMealComplement: [] as Food[],
  });

  const saveHandler = () => {
    // Basic defaults to avoid errors. Real implementation needs proper target calculation forms.
    const plan = DietEngine.generatePlan(
      data.name,
      data.fruits.length > 0 ? data.fruits : FoodDatabase.getFruits(),
      250, 
      data.firstMeal.length > 0 ? data.firstMeal : FoodDatabase.getFirstMealFoods(),
      250, 
      data.secondMealBase.length > 0 ? data.secondMealBase : FoodDatabase.getSecondMealFoodsByCategory('BASE'),
      200, 
      data.secondMealComplement.length > 0 ? data.secondMealComplement : FoodDatabase.getSecondMealFoodsByCategory('COMPLEMENT'),
      200, 
      data.secondMealBase.length > 0 ? data.secondMealBase : FoodDatabase.getSecondMealFoodsByCategory('BASE'),
      200, 
      data.secondMealComplement.length > 0 ? data.secondMealComplement : FoodDatabase.getSecondMealFoodsByCategory('COMPLEMENT'),
      200
    );

    saveClient({
      name: data.name,
      plan: plan,
    });
    router.push("/viewer");
  };

  const updateFruitHandler = (foods: Food[]) => {
    setData({ ...data, fruits: foods });
  };
  const updateFirstMealHandler = (foods: Food[]) => {
    setData({ ...data, firstMeal: foods });
  };

  const updateSecondMealBaseHandler = (foods: Food[]) => {
    setData({ ...data, secondMealBase: foods });
  };
  
  const updateSecondMealComplementHandler = (foods: Food[]) => {
    setData({ ...data, secondMealComplement: foods });
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
            foods={FoodDatabase.getFruits()}
            handler={updateFruitHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Primera Comida"
            foods={FoodDatabase.getFirstMealFoods()}
            handler={updateFirstMealHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Proteinas"
            foods={FoodDatabase.getSecondMealFoodsByCategory("BASE")}
            handler={updateSecondMealBaseHandler}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <FoodList
            title="Carbohidratos"
            foods={FoodDatabase.getSecondMealFoodsByCategory("COMPLEMENT")}
            handler={updateSecondMealComplementHandler}
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
