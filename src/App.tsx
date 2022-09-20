import { Box, Button, InputAdornment, TextField, ThemeProvider, Typography } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react'
import { darkTheme, lightTheme } from './themes'
import { CalculateFruits } from './adapters/CalculateFruits';


const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Fruta' },
  { field: 'col2', headerName: 'Gramos' },
];

// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

// TODO: Move to a reusable component 
const App = () => {

  const mapFriuts = (gramsTarget: number): GridRowsProp => {
    return CalculateFruits(gramsTarget).map((fruit, index) => {
      console.log(fruit)
      return { id: index, col1: fruit.name, col2: fruit.totalGrams }
    })
  }
  const [data, setData] = useState({
    gramsTarget: 0,
    rows: mapFriuts(0)
  });

  const handleFruitGramsChange = 
  (event: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, gramsTarget: parseInt(event.target.value), rows: mapFriuts(parseInt(event.target.value))  });
    };

  return (
    <ThemeProvider theme={lightTheme}>


      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Current theme: Light</Typography>
      <TextField
        id="gramsTarget"
        label="Gramos"
        type="number"
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment position="start">gr</InputAdornment>,
        }}
        onChange={handleFruitGramsChange}
      />
      <Box sx={{ height: 500, backgroundColor: 'primary' }}>
        <DataGrid
          rows={data.rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App
