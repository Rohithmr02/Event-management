import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import {toast} from 'react-toastify'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const url="http://localhost:5000"
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${url}/auth/user/login`, { email, password });
      if (res.data.message === "User not found"){
        toast.error("User not found.")
      }
      else if (res.data.message === "Invalid credentials"){
        toast.error("Invalid credentials")
      }else{
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
      }
    } catch (error) {
      console.error("Login Failed", error.response?.data);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response= await axios.post(`${url}/auth/user/register`, { name, email, password });
      if(response.data.message === "User already exists"){
        toast.warning("User already exists")
      }
      if(response.data.message === "User registered successfully"){
        toast.success("User registered successfully")
        
      }
    } catch (error) {
      console.error("Registration Failed", error.response?.data);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{url,user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
