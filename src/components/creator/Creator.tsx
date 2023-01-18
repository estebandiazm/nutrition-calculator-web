import { Button, Grid, TextField, ThemeProvider, Typography } from '@mui/material'
import { lightTheme } from '../../themes'
import { useNavigate } from 'react-router-dom';

import FruitList from '../fruits/FruitList';
import FirstFood from '../first-food/FirstFoodList';
import SecondFood from '../second-food/SecondFoodList';
import React, { useState } from 'react';
import { useContext } from 'react';
import { ClientContext } from '../../context/ClientContext';
import { ClientContextType } from '../../model/ClientContextType';

const Creator = () => {

  const navigate = useNavigate();

  const {saveClient} = useContext(ClientContext) as ClientContextType

  const [data, setData] = useState({
    name: ''
  })

  const saveHandler = () => {

    saveClient({name: data.name})
    navigate('/viewer');
  }

  const storeName = (event:React.ChangeEvent<HTMLInputElement> ) => {
    setData({name: event.target.value})
  }

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
      <TextField id="full-name" label="Nombre" variant="filled" sx={{ mb: 2 }} onChange={storeName}/>
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
        <Button variant="contained" onClick={saveHandler}>Guardar</Button>
      </Grid>
    </ThemeProvider>
  )
}

export default Creator
function setData(arg0: { name: any; }) {
  throw new Error('Function not implemented.');
}

