import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Food } from '../../model/Food';

const foodOne: Food[] = [
  { 'name': 'Avena', 'grams': 90, 'category': 'BASE', 'totalGrams': 90},
  { 'name': 'Arroz', 'grams': 192, 'category': 'COMPLEMENT', 'totalGrams': 90 },
  { 'name': 'Tocineta', 'grams': 45, 'category': 'COMPLEMENT', 'totalGrams': 90 },
  { 'name': 'Granola', 'grams': 77, 'category': 'COMPLEMENT', 'totalGrams': 90 },
  { 'name': 'Arepa Masmai', 'grams': 2, 'category': 'COMPLEMENT', 'totalGrams': 90 },
  { 'name': 'froot loops + 250ml', 'grams': 55, 'category': 'COMPLEMENT', 'totalGrams': 90 },
]
const Viewer = () => {
  return (
    <div>
        <Typography variant='h5'>Nombre: Juan Esteban Diaz Montejo</Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Comida 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comida</TableCell>
                  <TableCell>Gramos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                 {foodOne.map((food)=>  (
                  <TableRow>
                    <TableCell>{food.name}</TableCell>
                    <TableCell>{food.totalGrams}</TableCell>
                  </TableRow>
                 ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Comida 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Comida 3</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}

export default Viewer
