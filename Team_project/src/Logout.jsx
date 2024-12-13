import React from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication status (in this case, from localStorage)
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
