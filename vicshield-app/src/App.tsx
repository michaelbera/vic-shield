import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./home/Page";

import "./App.css";
import Contracts from "./pages/contracts/Page";
import KYCPage from "./pages/kyc/Page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contracts", element: <Contracts /> },
      { path: "/kyc", element: <KYCPage /> },
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
