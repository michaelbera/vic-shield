import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/home/Page";

import "./App.css";
import Contracts from "./pages/contracts/Page";
import KYCPage from "./pages/kyc/Page";
import Login from "./pages/login/Page";
import Navbar from "./components/Header";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contracts", element: <Contracts /> },
      { path: "/kyc", element: <KYCPage /> },
      { path: "/login", element: <Login /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;
