import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ThemeProvider } from '@mui/material';
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
        <Typography variant='h5' sx={{ m: 2 }}>Nombre: {client.name}</Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Frutas</Typography>
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
            <Typography>Comida 1</Typography>
          </AccordionSummary>
                     <AccordionDetails>
            <FoodTable list={client.plan?.firstMeal!}></FoodTable>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Comida 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FoodTable list={client.plan?.secondMeal!}></FoodTable>
          </AccordionDetails>
        </Accordion>
        <Button variant="contained" onClick={saveHandler} sx={{ width: '100%' }}>Regresar</Button>
      </React.Fragment>
    </ThemeProvider>

  );
}

export default Viewer
