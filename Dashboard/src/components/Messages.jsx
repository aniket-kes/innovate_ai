import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
            "http://localhost:7000/api/v1/user/user/me",
            {withCredentials:true, headers:{ "Content-Type": "application/json"}}
        );
        console.log(data);
        setUsers(data.user);
        console.log(users);
        // setMessages(data.messages);
      }catch(error){
          console.log(error.message);
      }
    };
  fetchMessages();
  }, []);
  // if (!isAuthenticated) {
  //   return <Navigate to={"/login"} />;
  // }
  return (
    <section className="page messages">
        <h1>MESSAGE</h1>
        <div className="banner">
        {users ? (
          users.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ):(
            <h1>No Messages!</h1>
        )}
         </div>
    </section>
  );
};
export default Messages;