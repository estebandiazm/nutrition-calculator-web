import { Box, Button, ThemeProvider, Typography } from '@mui/material'
import { useState } from 'react'
import { darkTheme, lightTheme } from './themes'


// Aca va todo lo que se pueda poner como HOC High Order Coponent
const App = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>


      {/* Se debe remplazar todo lo de acá por el enrutador */}
      <Typography variant='h2' component='h2' sx={{ mb: 2 }}>Current theme: {isDark ? 'Dark' : 'Light'}</Typography>
      <Box>
        <Button color='primary'>Primary outline</Button>
        <Button variant='contained' color='secondary'>Primary outline</Button>

        <Button color='info'>Primary outline</Button>

        <Box>
          <Button onClick={ () => setIsDark(!isDark) }>Change Theme</Button>
        </Box>

      </Box>
    </ThemeProvider>
  )
}

export default App
