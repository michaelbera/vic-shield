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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contracts", element: <Contracts /> },
      { path: "/contracts/create", element: <CreateContractPage /> },
      { path: "/contracts/:id", element: <ContractDetailsPage /> },
      { path: "/kyc", element: <KYCPage /> },
      { path: "/login", element: <Login /> },
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
