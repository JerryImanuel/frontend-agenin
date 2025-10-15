import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RouteLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Dompet from "../pages/Dompet";
import Downline from "../pages/Downline";
import Produk from "../pages/Produk";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { index: true, element: <Dashboard /> },
          { path: "dompet", element: <Dompet /> },
          { path: "downline", element: <Downline /> },
          { path: "produk", element: <Produk /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
]);
