import { React, useState } from "react";
import { Context } from "../main";

import Message from "../components/Message";
import Input from "../components/Input";
import History from "../components/History";
import Clear from "../components/Clear";

import axios from "axios";

import "./chat.css";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  //const auth = React.useContext(Context);

  const handleSubmit = async () => {
    const prompt = {
      role: "user",
      content: input
    };

    const chat = await sendChatRequest(prompt.role, prompt.content);
    setMessages([...messages, prompt]);

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...messages, prompt]
      })
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
         const res = data.choices[0].message.content;
         setMessages((messages) => [
           ...messages,
           {
             role: "assistant",
             content: res
           }
        ]);
        setHistory((history) => [...history, { question: input, answer: res }]);
        setInput("");
      });
  };

  const clear = async() => {
    // const res = await axios.delete("http://localhost:7000/api/v1/user/delete");
    // if (res.status !== 200) {
    //   throw new Error("Unable to delete chats");
    // }
    // const data = await res.message;
    setMessages([]);
    setHistory([]);
  };
  

  const sendChatRequest = async (role, message) => {
    const res = 
      await axios
        .post(
          "http://localhost:7000/api/v1/user/new",
          { id:"", role, message},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status !== 200) {
          throw new Error("Unable to send chat");
        }
        const data = await res.data;
        return data;
  };

  return (
    <div className="chat-app">
      <div className="Column">
        <h3 className="Title">Chat Messages</h3>
        <div className="Content">
          {messages.map((el, i) => {
            return <Message key={i} role={el.role} content={el.content} />;
          })}
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
        />
      </div>  
      <div className="Column">
        <h3 className="Title">History</h3>
        <div className="Content">
          {history.map((el, i) => {
            return (
              <History
                key={i}
                question={el.question}
                onClick={() =>
                  setMessages([
                    { role: "user", content: history[i].question },
                    { role: "assistant", content: history[i].answer }
                  ])
                }
              />
            );
          })}
        </div>
        <Clear onClick={clear} />
      </div>
    </div>
  );
}
