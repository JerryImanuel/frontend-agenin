import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "boxicons/css/boxicons.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./router/RouteLayout";
import Dashboard from "./pages/Dashboard";
import Downline from "./pages/Downline";
import Dompet from "./pages/Dompet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dompet", element: <Dompet /> },
      { path: "downline", element: <Downline /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
