import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Messages from "./components/Messages";
import Header from "./pages/Header";
import Rules from "./pages/Rules"
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);
  return (
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Header/> } />
          <Route path="/login" element={<Login />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
  );
};

export default App;

