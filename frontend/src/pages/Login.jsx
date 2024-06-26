import axios from "axios";
import "./login.css";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [user, setUser] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:7000/api/v1/user/login",
          { email, password, confirmPassword, role: "User" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          // console.log(res.data.user.timedOut);
          if (res.data.user.timedOut) {
            // Display a message or prevent the user from logging int
            toast.success("You are timed out. Please contact the admin for assistance.");
            alert("You are timed out. Please contact the admin for assistance.");
            return;
          }
          // console.log(res.data.message);
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/chat");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
    
      <div className="container form-component login-form">
        <h2 style={{color:"white"}}>Sign In</h2>
        <p>Please Login To Continue</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Not Registered?</p>
            <Link
              to={"/signup"}
              style={{ textDecoration: "none", color: "rgb(220, 67, 16)" }}
            >
              Register Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
