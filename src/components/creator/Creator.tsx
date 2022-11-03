import { Box, Button, Chip, Grid, InputAdornment, TextField, ThemeProvider, Typography, useTheme } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState } from 'react'
import { darkTheme, lightTheme } from '../../themes'

import FruitList from '../fruits/FruitList';
import FirstFood from '../first-food/FirstFoodList';
import SecondFood from '../second-food/SecondFoodList';




// TODO: Move to a reusable component
const Creator = () => {

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
          <SecondFood />
        </Grid>
        <Button variant="contained">Guardar</Button>
      </Grid>
    </ThemeProvider>
  )
}

export default Creator
