
import Creator from './components/creator/Creator';
import { createBrowserRouter, createHashRouter, Link, RouterProvider } from 'react-router-dom';
import React from 'react';
import Viewer from './components/viewer/Viewer';
import { createBrowserHistory } from 'history';
import ClientProvider, { ClientContext } from './context/ClientContext';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Creator />
  },
  {
    path: "/viewer",
    element: <Viewer />
  }
]);

const App = () => {

  return (
    <React.StrictMode>
      <ClientProvider>
        <RouterProvider router={router} />
      </ClientProvider>
    </React.StrictMode>
  )
}


export default App
