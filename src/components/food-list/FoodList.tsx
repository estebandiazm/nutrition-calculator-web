import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { useState } from "react";
import { DietEngine } from "../../domain/services/DietEngine";
import { Food } from "../../domain/types/Food";

const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Alimento', flex: 1 },
    {
        field: 'col2',
        headerName: 'Gramos',
        align: 'center',
        renderCell: (({ row }: any) => {
            return (
                <Typography sx={{ color: '#216eb1' }}>{row.col2}</Typography>
            )
        })
    },
];

const mapFruits = (gramsTarget: number, foods: Food[]): GridRowsProp => {
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
        const targetValue = parseInt(event.target.value);
        if (isNaN(targetValue) || targetValue <= 0) return;

        // DietEngine calculates FoodOptions (with grams) rather than mutating Food objects with 'totalGrams'
        const foodCalculatedOptions = DietEngine.calculateBlockOptions(targetValue, foods);
        
        // Temporarily map FoodOptions back to legacy Food[] expected by the upstream handler 
        const mappedFoods: Food[] = foodCalculatedOptions.map((opt, i) => ({
             name: opt.foodName,
             grams: foods[i].grams,
             totalGrams: opt.grams,
             category: foods[i].category
        }));

        props.handler(mappedFoods);
        
        setData({
            ...data,
            gramsTarget: targetValue,
            rows: mapFruits(targetValue, mappedFoods)
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
                    autoPageSize={true}
                />
            </Box>
        </Box>
    )
}

export default FoodList