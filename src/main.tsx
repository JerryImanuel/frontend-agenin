import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "boxicons/css/boxicons.min.css";
import { RouterProvider } from "react-router-dom";
import { TokenProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import { router } from "./router/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TokenProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </TokenProvider>
  </React.StrictMode>
);
