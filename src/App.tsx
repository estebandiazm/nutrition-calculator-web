import { Box, Button, Chip, Grid, InputAdornment, TextField, ThemeProvider, Typography, useTheme } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState } from 'react'
import { darkTheme, lightTheme } from './themes'

import FruitList from './components/fruits/FruitList';




// TODO: Move to a reusable component
const App = () => {

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <FruitList/>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App
