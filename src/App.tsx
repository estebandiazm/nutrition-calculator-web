import React from 'react';
import ClientProvider from './context/ClientContext';
import { AppRouter } from './router/AppRouter';

const App = () => {

  return (
    <React.StrictMode>
      <ClientProvider>
        <AppRouter />
      </ClientProvider>
    </React.StrictMode>
  )
}


export default App
