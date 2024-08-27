import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgetPassword from "./pages/forgetPassword";
import ResetPassword from "./pages/resetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forget",
        element: <ForgetPassword />,
      },
      {
        path: "reset/:token",
        element: <ResetPassword />,
      },
      {
        path: "/admin/product",
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
