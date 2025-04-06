import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  const apiUrl = useSelector((state) => state.apiUrl);
  useEffect(() => {
    const checkAuth = async () => {
      const id = window.localStorage.getItem("id");
      const token = window.localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.post(`${apiUrl}/verify-token`, {}, {
            headers:{
              Authorization: token || '',
              'X-User-ID': id || '',
              'Content-Type': 'application/json',
            }
          });
          if (response.data.success) {
            dispatch({ type: 'set', id: id, token: token, isAuthenticated: true });
          } else {
            dispatch({ type: 'clear_credentials' });
          }
        } catch (error) {
          dispatch({ type: 'clear_credentials' });
          console.error("Error during token verification:", error);
        }
      } else {
        dispatch({ type: 'clear_credentials' });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
