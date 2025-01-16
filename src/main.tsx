import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PageNotFound from "./PageNotFound.tsx";
import { Dashboard } from "./app/components/Dashboard.tsx";
import { Layout } from "./app/components/Layout.tsx";
import { LoginForm } from "./app/components/LoginForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Navigate to={"/home"} />,
      },
      {
        path: "home",
        element: <Layout />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
