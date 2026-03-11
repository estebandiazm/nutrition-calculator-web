'use client'

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Button, Grid, Stack, ThemeProvider, Chip, Box, Divider } from "@mui/material";
import FoodTable from "../food-table/FoodTable";
import React, { useContext, useEffect, useState } from "react";
import { ClientContext } from "../../context/ClientContext";
import { ClientContextType } from "../../context/ClientContextType";
import { lightTheme } from "../../themes";
import { useRouter } from "next/navigation";
import { DietPlan } from "../../domain/types/DietPlan";

interface ViewerProps {
  overridePlans?: DietPlan[];
  overrideClientName?: string;
}

const Viewer = ({ overridePlans, overrideClientName }: ViewerProps = {}) => {
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

  const clientName = overrideClientName ?? client.name;
  const plans: DietPlan[] = overridePlans ?? client.plans ?? [];

  if (!clientName && !overridePlans) {
    return <Typography sx={{ m: 4 }}>Cargando cliente...</Typography>;
  }

  const saveHandler = () => {
    router.back();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ m: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {clientName ? clientName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h5">Nombre: {clientName}</Typography>
          {!overridePlans && client.targetWeight && (
            <Typography variant="body2" color="text.secondary">
              Peso objetivo: {client.targetWeight} kg
            </Typography>
          )}
        </Stack>

        {plans.length === 0 && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No hay planes guardados para este cliente.
          </Typography>
        )}

        {plans.map((plan: DietPlan, planIndex: number) => (
          <Box key={planIndex} sx={{ mb: 4 }}>
            {/* Plan header */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                {plan.label ?? `Plan ${planIndex + 1}`}
              </Typography>
              {plan.days && (
                <Chip label={plan.days} size="small" color="primary" variant="outlined" />
              )}
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {plan.meals.map((meal: any, index: number) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`plan${planIndex}-panel${index}-content`}
                  id={`plan${planIndex}-panel${index}-header`}
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
                        <FoodTable
                          list={block.options.map((opt: any) => ({
                            name: opt.foodName,
                            totalGrams: opt.grams,
                            category: block.blockType as any,
                            grams: opt.grams
                          }))}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
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
