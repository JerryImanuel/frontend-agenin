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

import RoleRoute from "./RoleRoute";

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

          // UPDATE: dompet hanya untuk AGENT
          {
            path: "dompet",
            element: (
              <RoleRoute roles={["AGENT"]}>
                <Dompet />
              </RoleRoute>
            ),
          },

          // downline & produk untuk ADMIN dan AGENT
          {
            path: "downline",
            element: (
              <RoleRoute roles={["ADMIN", "AGENT"]}>
                <Downline />
              </RoleRoute>
            ),
          },
          {
            path: "produk",
            element: (
              <RoleRoute roles={["ADMIN", "AGENT"]}>
                <Produk />
              </RoleRoute>
            ),
          },

          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
]);
