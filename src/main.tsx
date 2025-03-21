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
import { hasDashboardAccess } from "./utils/auth";
import { LoginForm } from "./app/components/LoginForm.tsx";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("access") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Dashboard route component with access control
const DashboardRoute = () => {
  if (!hasDashboardAccess()) {
    return <Navigate to="/conference" />;
  }
  return <DashboardPage />;
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
        element: <LoginForm />,
      },
      {
        path: "conference",
        element: <Conference />,
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
            <DashboardRoute />
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
