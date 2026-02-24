'use client'

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Button, Grid, Stack, ThemeProvider, Chip, Box } from "@mui/material";
import FoodTable from "../food-table/FoodTable";
import React, { useContext, useEffect, useState } from "react";
import { ClientContext } from "../../context/ClientContext";
import { ClientContextType } from "../../context/ClientContextType";
import { lightTheme } from "../../themes";
import { useRouter } from "next/navigation";

const Viewer = () => {
  const router = useRouter();
  const { client } = useContext(ClientContext) as ClientContextType;

  let [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    console.log(client)
  }, [client]);

  if (!isLoaded) {
    return <Typography sx={{ m: 4 }}>Cargando cliente...</Typography>;
  }

  console.log(client)
  if (!client.name) {
    return <Typography sx={{ m: 4 }}>Cargando cliente...</Typography>;
  }

  const saveHandler = () => {
    router.push("/");
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ m: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {client.name ? client.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h5">Nombre: {client.name}</Typography>
        </Stack>
        {client.plan?.meals.map((meal: any, index: number) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h2">{meal.mealName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {meal.blocks.map((block: any, bIndex: number) => (
                  <Grid size={{ xs: 12, sm: 12, md: Math.max(12 / meal.blocks.length, 6) }} key={bIndex}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
                      <Chip label={block.blockType} color="primary" variant="outlined" size="small" />
                    </Stack>
                    
                    {/* The FoodTable component currently expects `Food[]`, we will adapt it mapped options */}
                    <FoodTable
                      list={block.options.map((opt: any) => ({
                        name: opt.foodName,
                        totalGrams: opt.grams,
                        category: block.blockType as any,
                        grams: opt.grams
                      }))}
                    ></FoodTable>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          variant="contained"
          onClick={saveHandler}
          sx={{ width: "100%", mt: 2 }}
        >
          Regresar
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Viewer
