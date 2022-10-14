import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { CalculateFoodSimple } from "../../adapters/CalculateFood";
import { Food } from "../../model/Fruit";


const foodOne: Food[] = [
  { 'name': 'Avena', 'grams': 90 },
  { 'name': 'Arroz', 'grams': 192 },
  { 'name': 'Tocineta', 'grams': 45 },
  { 'name': 'Granola', 'grams': 77 },
  { 'name': 'Arepa Masmai', 'grams': 2 },
  { 'name': 'froot loops + 250ml', 'grams': 55 },
]

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Alimento', flex: 1 },
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
  return CalculateFoodSimple(gramsTarget, foodOne).map((fruit, index) => {
    return { id: index, col1: fruit.name, col2: fruit.totalGrams }
  })
}

const FirstFood = () => {
  const [data, setData] = useState({
    gramsTarget: 0,
    rows: mapFruits(0)
  });

  return (
    <Box>
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Comida 1</Typography>
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

export default FirstFood