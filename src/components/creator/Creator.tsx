import { Button, Grid, TextField, ThemeProvider, Typography } from '@mui/material'
import { lightTheme } from '../../themes'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useContext } from 'react';
import { ClientContext } from '../../context/ClientContext';
import { ClientContextType } from '../../model/ClientContextType';
import { fruits, firstMeal, secondMeal } from '../../adapters/GetFood';
import FoodList from '../food-list/FoodList';
import { Food } from '../../model/Food';

const Creator = () => {

  const navigate = useNavigate();

  const { saveClient } = useContext(ClientContext) as ClientContextType

  const [data, setData] = useState({
    name: '',
    fruits: [] as Food[],
    firstMeal: [] as Food[],
    secondMeal: [] as Food[],
  })

  const saveHandler = () => {
    saveClient({
      name: data.name, plan: {
        fruits: fruits,
        firstMeal: firstMeal,
        secondMeal: secondMeal
      }
    })
    navigate('/viewer');
  }

  const updateFruitHandler = (foods: Food[]) => {
    setData({ ...data, fruits: foods })
  }
  const updateFirstMealHandler = (foods: Food[]) => {
    setData({ ...data, firstMeal: foods })
  }

  const updateSecondMealHandler = (foods: Food[]) => {
    setData({ ...data, secondMeal: foods })
  }

  const storeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: event.target.value, })
  }

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
      <TextField id="full-name" label="Nombre" variant="filled" sx={{ mb: 2 }} onChange={storeName} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <FoodList title='Frutas' foods={fruits} handler={updateFruitHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FoodList title='Primera Comida' foods={firstMeal} handler={updateFirstMealHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FoodList title='Segunda Comida' foods={secondMeal} handler={updateSecondMealHandler} />
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

