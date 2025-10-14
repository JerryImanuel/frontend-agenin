import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "boxicons/css/boxicons.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./router/RouteLayout";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Dompet from "./pages/Dompet";
import Downline from "./pages/Downline";
import Produk from "./pages/Produk";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
);
