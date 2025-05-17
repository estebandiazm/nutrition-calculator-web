import {Button, Grid, TextField, ThemeProvider, Typography} from '@mui/material'
import {lightTheme} from '../../themes'
import {useNavigate} from 'react-router-dom';
import React, {useContext, useState} from 'react';
import {ClientContext} from '../../context/ClientContext';
import {ClientContextType} from '../../model/ClientContextType';
import {firstMeal, fruits, secondMeal} from '../../adapters/GetFood';
import FoodList from '../food-list/FoodList';
import {Food} from '../../model/Food';
import {Face} from "@mui/icons-material";

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
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField id="full-name" label="Nombre" sx={{mb: 2, width: '75%', mr: 2}} variant="filled"
                     onChange={storeName} InputProps={{endAdornment: <Face/>}}/>
          <TextField id="body-weight" label="Peso" sx={{mb: 2, width: '20%'}} variant="filled" onChange={storeName}
                     InputProps={{endAdornment: <Face/>}}/>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <FoodList title='Frutas' foods={fruits} handler={updateFruitHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <FoodList title='Primera Comida' foods={firstMeal} handler={updateFirstMealHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <FoodList title='Proteinas' foods={secondMeal.filter(food => food.category === 'BASE')} handler={updateSecondMealHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <FoodList title='Carbohidratos' foods={secondMeal.filter(food => food.category === 'COMPLEMENT')} handler={updateSecondMealHandler} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button variant="contained" onClick={saveHandler} sx={{width:'100%', height:'3em'}}>Guardar</Button>
        </Grid>
      </Grid>
    </ThemeProvider >
  )
}

export default Creator
