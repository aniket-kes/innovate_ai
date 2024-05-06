import axios from "axios";
import "./login.css"
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  // const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [user, setUser] = useState({});

  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");


  const navigateTo = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      console.log({firstName,lastName,email,password});
      await axios
      .post(
        "http://localhost:7000/api/v1/user/user/register",
        {firstName,lastName,email,password},
        {
          withCredentials:true,
          headers:{ "Content-Type": "application/json"},
        }
      )
      .then((res)=>{
        toast.success(res.data.message);
        setIsAuthenticated(true);
        navigateTo("/");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      });
    } catch(error){
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  if(isAuthenticated){
    return <Navigate to={"/chat"} />
  }
  
  return (
    <>
      <div className="container form-component register-form">
        <h2 style={{color:"white"}}>Sign Up</h2>
        <p>Please Sign Up To Continue</p>
        <form onSubmit={handleRegistration}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Already Registered?</p>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "rgb(220, 67, 16)" }}
            >
              Login Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
