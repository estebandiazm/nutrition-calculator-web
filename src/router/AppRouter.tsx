import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom"
import Creator from "../components/creator/Creator"
import Viewer from "../components/viewer/viewer"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Creator />,
  },
  {
    path: "nutrition-calculator-web/viewer",
    element: <Viewer />
  }
], {
  basename: "/nutrition-calculator-web"
});

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
