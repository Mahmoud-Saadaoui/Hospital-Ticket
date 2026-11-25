import App from "./App.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

function Router() {
  const auth = true

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { 
          path: "/login",
          element: !auth ? <Login /> : <Navigate to="/"/> ,
        },
        {
          path: "/register",
          element:  !auth ? <Register /> : <Navigate to="/"/>,
        },
        {
          path: "/profile",
          element:  auth ? <Profile /> : <Navigate to="/"/> ,
        },
        { path: "/*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;