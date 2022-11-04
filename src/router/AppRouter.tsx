import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Creator from "../components/creator/Creator"
import Viewer from "../components/viewer/viewer"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Creator />,
  },
  {
    path: "viewer",
    element: <Viewer />
  }
]);

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
