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
        <Box sx={{ 
            border: "1px solid rgba(59, 130, 246, 0.3)", 
            borderRadius: "16px", 
            p: 2, 
            mb: 2, 
            backgroundColor: "rgba(255, 255, 255, 0.6)", 
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(31, 38, 135, 0.05)",
            height: "100%"
        }}>
            <Typography variant='h2' component='h2' sx={{ 
                mb: 3, 
                fontWeight: 700, 
                color: "#1E3A8A", 
                borderBottom: "3px solid #0EA5E9",
                display: "inline-block",
                pb: 0.5 
            }}>{props.title}</Typography>
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