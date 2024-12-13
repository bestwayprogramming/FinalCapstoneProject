import React from "react";
import { Navigate } from "react-router-dom";
import PageNotFound from "../Pages/PageNotFound";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check if user is logged in
  const userType = localStorage.getItem("userType"); // Get the user type from localStorage

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user type is not in allowedRoles, display the 404 page
  if (!allowedRoles.includes(userType)) {
    return <PageNotFound />;
  }

  return children;
};

export default ProtectedRoute;
