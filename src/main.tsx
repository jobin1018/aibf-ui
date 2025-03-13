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
import { Layout } from "./app/components/Layout.tsx";
import { Conference } from "./app/components/Conference.tsx";
import { ContactForm } from "./app/components/ContactForm.tsx";
import { DashboardPage } from "./app/dashboard/page";
import RegisterPage from "./app/pages/register/page";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("access") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Layout />,
      },
      {
        path: "home",
        element: <Navigate to="/" />,
      },
      {
        path: "login",
        element: <Conference />,
      },
      {
        path: "conference",
        element: (
          <ProtectedRoute>
            <Conference />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact",
        element: <ContactForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
