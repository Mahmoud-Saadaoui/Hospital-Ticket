import App from "./App.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useAuth from "./hooks/useAuth";

function Router() {
  const { t } = useTranslation();
  const { isAuthenticated, isInitializing } = useAuth();

  const publicElement = (element) => {
    if (isInitializing) {
      return (
        <div role="status" aria-live="polite">
          {t("common.loading", { defaultValue: "Loading..." })}
        </div>
      );
    }

    return isAuthenticated ? <Navigate to="/" replace /> : element;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { 
          path: "/login",
          element: publicElement(<Login />),
        },
        {
          path: "/register",
          element: publicElement(<Register />),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: "/*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
