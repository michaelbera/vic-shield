import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/home/Page";
import "./App.css";
import Contracts from "./pages/contracts/Page";
import KYCPage from "./pages/kyc/Page";
import Login from "./pages/login/Page";
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
      {
        path: "/kyc",
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={false}>
            <KYCPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
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
