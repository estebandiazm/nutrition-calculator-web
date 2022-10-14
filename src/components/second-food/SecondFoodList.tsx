import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { CalculateFoodSimple } from "../../adapters/CalculateFood";
import { Food } from "../../model/Fruit";

const foods: Food[] = [
  { 'name': 'Carne Res', 'grams': 300 },
  { 'name': 'Lomo cerdo', 'grams': 290 },
  { 'name': 'Pollo', 'grams': 253 },
  { 'name': 'Tilapia', 'grams': 310 },
  { 'name': 'Camarones', 'grams': 320 },
  { 'name': 'Pechuga Pavo', 'grams': 275 },
  { 'name': 'Pasta', 'grams':	210},
  { 'name': 'Arroz', 'grams': 200 },
  { 'name': 'Papa', 'grams':	275},
  { 'name': 'Yuca', 'grams':	163},
  { 'name': 'Quinoa', 'grams':	260},
  { 'name': 'Frijoles', 'grams':	172},
  { 'name': 'Lenteja', 'grams':	228},
  { 'name': 'Batata', 'grams':	216},
  { 'name': 'Maduro (cocido) dieta flex', 'grams': 	190},
  { 'name': 'Garbanzos', 'grams':	160},
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
  return CalculateFoodSimple(gramsTarget, foods).map((fruit, index) => {
    return { id: index, col1: fruit.name, col2: fruit.totalGrams }
  })
}

const SecondFood = () => {
  const [data, setData] = useState({
    gramsTarget: 0,
    rows: mapFruits(0)
  });

  return (
    <Box>
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Comida 2</Typography>
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

export default SecondFood