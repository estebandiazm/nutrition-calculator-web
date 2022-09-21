import { Box, Button, Chip, Grid, InputAdornment, TextField, ThemeProvider, Typography, useTheme } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState } from 'react'
import { darkTheme, lightTheme } from './themes'
import { CalculateFruits } from './adapters/CalculateFruits';


const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Fruta' },
  { 
    field: 'col2',
    headerName: 'Gramos',
    width: 400,
    align: 'center',
    renderCell: (({row}: any) => {
      return (
        <Typography sx={{color: 'green'}}>{row.col2}</Typography>
      )
    })
  },
];

const mapFruits = (gramsTarget: number): GridRowsProp => {
  return CalculateFruits(gramsTarget).map((fruit, index) => {
    // console.log(fruit)
    return { id: index, col1: fruit.name, col2: fruit.totalGrams }
  })
}

// TODO: Move to a reusable component
const App = () => {
  const [data, setData] = useState({
    gramsTarget: 0,
    rows: mapFruits(0)
  });

  return (
    <ThemeProvider theme={lightTheme}>

      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Current theme: Light</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            id="gramsTarget"
            label="Gramos"
            type="number"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="start">gr</InputAdornment>,
            }}
            onChange={(event) => setData({
              ...data,
              gramsTarget: parseInt(event.target.value),
              rows: mapFruits(parseInt(event.target.value))
            })}
          />
          <Box sx={{ height: 500, backgroundColor: 'primary' }}>
            <DataGrid
              rows={data.rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TextField
            id="gramsTarget"
            label="Gramos"
            type="number"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="start">gr</InputAdornment>,
            }}
            onChange={(event) => setData({
              ...data,
              gramsTarget: parseInt(event.target.value),
              rows: mapFruits(parseInt(event.target.value))
            })}
          />
          <Box sx={{ height: 500, backgroundColor: 'primary' }}>
            <DataGrid
              rows={data.rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App
