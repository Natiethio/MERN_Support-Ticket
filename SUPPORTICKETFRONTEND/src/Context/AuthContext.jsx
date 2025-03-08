import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../Utils/axiosInstance";
import { useDispatch, useSelector } from 'react-redux';
import { getauthUser } from '../redux/userSlice';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading = true
  const [isLoggedout, setIsLoggedout] = useState(true)
  const dispatch = useDispatch();
  const usersredux = useSelector(state => state.users.authuser)

  const fetchUser = async () => {
    try {
      setLoading(true); // Start loading
      const response = await api.get("/user/me", {
        withCredentials: true,
      });
      dispatch(getauthUser(response.data.user))
      setAuth(response.data.role); 
      setIsLoggedout(false)
    } catch (error) {
      setAuth(null);
      setIsLoggedout(true) 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUser();
}, []);

  const logout = async () => {
    try {
      await api.post("/user/logout", {}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setAuth(null); // Clear auth state on logout
      setIsLoggedout(true)
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  };

  const isAuthenticated = !!auth; // isAuthenticated derived from auth

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, fetchUser, setAuth, logout, loading, isLoggedout, setIsLoggedout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
