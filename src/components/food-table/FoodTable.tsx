import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Food } from "../../model/Food";


interface FoodTableProps {
    list: Food[]
}

const FoodTable = (props: FoodTableProps) => {
    return (<TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Comida</TableCell>
                    <TableCell>Gramos</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.list.map((food: Food) => (
                    <TableRow>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>{food.totalGrams}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>);
}

export default FoodTable