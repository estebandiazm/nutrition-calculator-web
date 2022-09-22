import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { CalculateFruits } from '../../adapters/CalculateFruits';

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

const FruitList = () => {
    const [data, setData] = useState({
        gramsTarget: 0,
        rows: mapFruits(0)
      });

    return (
        <Box>
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