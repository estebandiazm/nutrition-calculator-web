
import Creator from './components/creator/Creator';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Viewer from './components/viewer/viewer';



const router = createHashRouter([
  {
    path: "",
    element: <Creator />,
    children: [
      {
        path: "viewer",
        element: <Viewer />
      }
    ],
  }
]);

// TODO: Move to a reusable component
const App = () => {

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
