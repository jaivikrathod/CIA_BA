import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const apiUrl = "http://localhost:3005"; 

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const id = window.localStorage.getItem("id");
      const token = window.localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.post(`${apiUrl}/verify-token`, { id, token });
          if (response.data.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.error("Error during token verification:", error);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
 }
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};
export default PrivateRoute;
