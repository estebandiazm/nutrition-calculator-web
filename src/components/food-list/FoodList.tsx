import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { CalculateFoodSimple } from "../../adapters/CalculateFood";
import { Food } from "../../model/Food";

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

const mapFruits = (gramsTarget: number, foods: Food[]): GridRowsProp => {
    console.log(foods)
    return foods.map((fruit, index) => {
        return { id: index, col1: fruit.name, col2: fruit.totalGrams }
    })
}

type Props = {
    title: string;
    foods: Food[];
    handler: (foods: Food[]) => void;
}

const FoodList = (props: Props) => {

    const { foods } = props
    const [data, setData] = useState({
        gramsTarget: 0,
        rows: mapFruits(0, foods)
    });

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const foodCalculated = CalculateFoodSimple(parseInt(event.target.value), foods)
        props.handler(foodCalculated)
        setData({
            ...data,
            gramsTarget: parseInt(event.target.value),
            rows: mapFruits(parseInt(event.target.value), foodCalculated)
        })
    }
    return (
        <Box>
            <Typography variant='h2' component='h2' sx={{ mb: 2 }}>{props.title}</Typography>
            <TextField
                id="gramsTarget"
                label="Gramos"
                type="number"
                sx={{ mb: 2, width: '100%' }}
                variant="outlined"
                InputProps={{
                    endAdornment: <InputAdornment position="start">gr</InputAdornment>,
                }}
                onChange={onChangeHandler}
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

export default FoodList