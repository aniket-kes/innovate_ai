import { React, useState } from "react";
import { Context } from "../main";

import Message from "../components/Message";
import Input from "../components/Input";
import History from "../components/History";
import Clear from "../components/Clear";

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

  const clear = () => {
    setMessages([]);
    setHistory([]);
  };
  const handleDB = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "",
          { email, password, confirmPassword, role: "User" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
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
