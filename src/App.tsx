import { Box, Button, ThemeProvider, Typography } from '@mui/material'
import { useState } from 'react'
import { darkTheme, lightTheme } from './themes'


// Aca va todo lo que se pueda poner como HOC High Order Coponent
const App = () => {

  const [datos, setDatos] = useState({
    gramsInput: '',
    fruits: [
      { 'name': 'Pina', 'grams': 150 },
      { 'name': 'papaya', 'grams': 175 },
      { 'name': 'Melon', 'grams': 207 },
      { 'name': 'Pera', 'grams': 130 },
      { 'name': 'Mango', 'grams': 125 },
      { 'name': 'Manzana', 'grams': 144 },
      { 'name': 'Banano', 'grams': 84 },
      { 'name': 'Kiwi', 'grams': 123 },
    ]
  });


  return (
    <ThemeProvider theme={lightTheme}>


      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Current theme: Light'</Typography>
      <Box>
        <Button color='primary'>Primary outline</Button>
        <Button variant='contained' color='secondary'>Primary outline</Button>

        <Button color='info'>Primary outline</Button>

        <Box>
          <Button onClick={() => { }}>Change Theme</Button>
        </Box>

      </Box>
      {/* <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box> */}
    </ThemeProvider>
  )
}

export default App
