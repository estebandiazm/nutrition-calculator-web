import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Avatar, Button, Grid, Stack, ThemeProvider} from '@mui/material';
import FoodTable from '../food-table/FoodTable';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useContext } from 'react';
import { ClientContext } from '../../context/ClientContext';
import { ClientContextType } from '../../model/ClientContextType';
import { lightTheme } from '../../themes';

const Viewer = () => {
  const navigate = useNavigate();
  const { client } = useContext(ClientContext) as ClientContextType

  const [data, setData] = useState({ name: '' })

  const saveHandler = () => {
    navigate('/');
  }
  return (
    <ThemeProvider theme={lightTheme}>
      <React.Fragment>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ m: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {client.name ? client.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Typography variant='h5'>Nombre: {client.name}</Typography>
        </Stack>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant='h2'>Frutas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FoodTable list={client.plan?.fruits!}></FoodTable>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant='h2'>Comida 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FoodTable list={client.plan?.firstMeal!}></FoodTable>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography variant='h2'>Comida 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:12, md:6}}>
                <Typography variant="h6">Proteina</Typography>
                <FoodTable list={client.plan?.secondMeal!.filter(food => food.category === 'BASE')!}></FoodTable>
              </Grid>
              <Grid size={{xs:12, sm:12, md:6}}>
                <Typography variant="h6">Carbohidratos</Typography>
                <FoodTable list={client.plan?.secondMeal!.filter(food => food.category === 'COMPLEMENT')!}></FoodTable>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography variant='h2'>Comida 3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:12, md:6}}>
                <Typography variant="h6" >Proteina</Typography>
                <FoodTable list={client.plan?.secondMeal!.filter(food => food.category === 'BASE')!}></FoodTable>
              </Grid>
              <Grid size={{xs:12, sm:12, md:6}}>
                <Typography variant="h6">Carbohidratos</Typography>
                <FoodTable list={client.plan?.secondMeal!.filter(food => food.category === 'COMPLEMENT')!}></FoodTable>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Button variant="contained" onClick={saveHandler} sx={{ width: '100%' }}>Regresar</Button>
      </React.Fragment>
    </ThemeProvider>

  );
}

export default Viewer
