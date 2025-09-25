import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/home/Page";
import "./App.css";
import Contracts from "./pages/contracts/Page";
import Layout from "./components/Layout";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requireAuth={false}>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contracts",
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={true}>
            <Contracts />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
