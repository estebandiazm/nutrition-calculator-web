import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { CalculateFoodSimple } from '../../adapters/CalculateFood';
import { Food } from "../../model/Food";


const fruits: Food[] = [
  { 'name': 'Pina', 'grams': 150, 'category': 'FRUIT' },
  { 'name': 'papaya', 'grams': 175, 'category': 'FRUIT' },
  { 'name': 'Melon', 'grams': 207, 'category': 'FRUIT' },
  { 'name': 'Pera', 'grams': 130, 'category': 'FRUIT' },
  { 'name': 'Mango', 'grams': 125, 'category': 'FRUIT' },
  { 'name': 'Manzana', 'grams': 144, 'category': 'FRUIT' },
  { 'name': 'Banano', 'grams': 84, 'category': 'FRUIT' },
  { 'name': 'Kiwi', 'grams': 123, 'category': 'FRUIT' },
]

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Fruta', flex: 1 },
  {
    field: 'col2',
    headerName: 'Gramos',
    align: 'center',
    renderCell: (({ row }: any) => {
      return (
        <Typography sx={{ color: 'red' }}>{row.col2}</Typography>
      )
    })
  },
];

const mapFruits = (gramsTarget: number): GridRowsProp => {
  return CalculateFoodSimple(gramsTarget, fruits).map((fruit, index) => {
    // console.log(fruit)
    return { id: index, col1: fruit.name, col2: fruit.totalGrams }
  })
}

const FruitList = () => {
  const [data, setData] = useState({
    gramsTarget: 0,
    rows: mapFruits(0)
  });

  return (
    <Box>
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Calculadora Nutricional</Typography>
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
    </Box>
  )
}

export default FruitList