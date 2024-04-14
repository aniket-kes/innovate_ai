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
    let sc = 0

    try{
      var data = {"text":input}
      const responseforscore = await fetch('http://127.0.0.1:5001/riskscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(response => response.json())
        .then(result => {
        console.log(result); 
        const prompt = {
          role: "user",
          score:result,
          // role:"assistant",
          content: input
        };
        setMessages([...messages, prompt]);
        setInput("")
    })
    }
    catch(error){
      console.log("Error:",error)
      const prompt = {
        role: "user",
        score:100,
        // role:"assistant",
        content: input
      };
      setMessages([...messages, prompt]);
    }

    var chat=""
    var data = {"text":input}
    const response = await fetch('http://127.0.0.1:5001/filtertext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(response => response.json())
        .then(result => {
          console.log(result); 
          chat = result;
        // setMessages((messages) => [
        //   ...messages,
        //   {
        //     role: "assistant",
        //     score:0,
        //     content: result
        //   }
        // ]);
    })

    //llmquery
    var llmresponse = ""
    try{
      var data = {"text":chat}
      const responseforscore3 = await fetch('http://127.0.0.1:5001/llmanswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(response => response.json())
        .then(result3 => {
        console.log(result3); 
        llmresponse = result3
    })
    }
    catch(error){
      console.log("Error:",error)
    }


    try{
      var data = {"text":chat}
      const responseforscore2 = await fetch('http://127.0.0.1:5001/riskscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }).then(response => response.json())
        .then(result2 => {
        console.log(result2); 
         setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            score:result2,
            content: chat,
            llmres:llmresponse
          }
        ]);
      
    })
    }
    catch(error){
      console.log("Error:",error)
      const reschat = {
        role: "assistant",
        score:0,
        // role:"assistant",
        content: chat,
        llmres:llmresponse
      };
      setMessages([...messages, reschat]);
    }
    // setHistory(messages)

    // await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     messages: [...messages, prompt]
    //   })
    // })
    //   .then((data) => data.json())
    //   .then((data) => {
    //     console.log(data);
        // const res = data.choices[0].message.content;
        // setMessages((messages) => [
        //   ...messages,
        //   {
        //     role: "assistant",
        //     content: res
        //   }
        // ]);
        // setHistory((history) => [...history, { question: input, answer: res }]);
        // setInput("");
     // });
  };

   {/* <div key={i}>
                <p>Text Risk Score: {el.score}</p> */}
                 {/* </div> */}
  const clear = () => {
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
            return (
              <div key={i}>
                <p>Text Risk Score: {el.score}%</p>
                
                <Message role={el.role} content={el.content} />
               <b><i>
                {el.llmres? <Message role={el.role} content={el.llmres} /> : <br></br>}
                </i></b>
              </div> 
              );

          })
          }
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
        />
      </div>
      {/* <div className="Column">
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
      </div> */}
    </div>
  );
}
