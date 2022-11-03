
import Creator from './components/creator/Creator';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Viewer from './components/viewer/viewer';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Creator />
  },
  {
    path: "/viewer",
    element: <Viewer/>
  }
], {basename:"/nutrition-calculator-web"} )

// TODO: Move to a reusable component
const App = () => {

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
