import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/home/Page";
import "./App.css";
import Contracts from "./pages/contracts/Page";
import CreateContractPage from "./pages/contracts/create/Page";
import ContractDetailsPage from "./pages/contracts/[id]/Page";
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
        ) 
      },
      { 
        path: "/contracts", 
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={true}>
            <Contracts />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/contracts/create", 
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={true}>
            <CreateContractPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/contracts/:id", 
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={true}>
            <ContractDetailsPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/kyc", 
        element: (
          <ProtectedRoute requireAuth={true} requireKyc={false}>
            <KYCPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/login", 
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ) 
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
