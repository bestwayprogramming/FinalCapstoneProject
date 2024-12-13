import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import SignupPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import AddProductPage from "../Pages/AddProductPage";
import ProductDetail from "../component/ProductDetail";
import Verification from "../component/Verification";
import AllProductPage from "../Pages/AllProductPage";
import Profile from "../component/Profile";
import ChatPage from "../Pages/ChatPage";
import WishlistPage from "../Pages/Wishlist";
import CartPage from "../Pages/CartPage";
import Checkout from "../component/Checkout";
import OrderPage from "../Pages/OrderPage";
import OrderHistoryPage from "../Pages/OrderHistoryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Redirect from root to /login
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addProduct",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <AddProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <ProtectedRoute allowedRoles={["seller","buyer"]}>
        <ProductDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Products",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <AllProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify",
    element: <Verification />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["seller", "buyer"]}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute allowedRoles={["seller", "buyer"]}>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorite",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <WishlistPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Checkout",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <OrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orderHistory",
    element: (
      <ProtectedRoute allowedRoles={["buyer"]}>
        <OrderHistoryPage />
      </ProtectedRoute>
    ),
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

