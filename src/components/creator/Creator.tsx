import { Button, Grid, ThemeProvider, Typography } from '@mui/material'
import { lightTheme } from '../../themes'
import { useNavigate } from 'react-router-dom';

import FruitList from '../fruits/FruitList';
import FirstFood from '../first-food/FirstFoodList';
import SecondFood from '../second-food/SecondFoodList';




// TODO: Move to a reusable component
const Creator = () => {

  const navigate = useNavigate();

  const saveHandler = () => {
    navigate('/viewer');
} 

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <FruitList />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FirstFood />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <SecondFood />ß
        </Grid>
        <Button variant="contained" onClick={saveHandler}>Guardar</Button>
      </Grid>
    </ThemeProvider>
  )
}

export default Creator
