import bot from "../assets/bot.png";
import user from "../assets/user.png";

import "./message.css";

export default function Message({ role, content }) {
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
