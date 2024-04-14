import bot from "../assets/bot.png";
import user from "../assets/user.png";
import React from "react";
import { Context } from "../main";

import "./message.css";

export default function Message({ role, content }) {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="msg-wrapper">
      <div>
        <img
          src={role === "assistant" ? bot : user}
          className="msg-avatar"
          alt="profile avatar"
        />
      </div>
      <div>
        <p>{content}</p>
      </div>
    </div>
  );
}

//SUN13APR2024