import { React, useState, useContext, useEffect } from "react";
import { Context } from "../main";

import Message from "../components/Message";
import Input from "../components/Input";
import History from "../components/History";
import Clear from "../components/Clear";

import axios from "axios";

import "./chat.css";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [QueryScore, setQueryScore] = useState(0);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [isTimedOut, setIsTimedOut] = useState(false);

  console.log(isAuthenticated);

  useEffect(() => {
    const checkUserTimeoutStatus = async () => {
      try {
        const res = await axios.get("http://localhost:7000/api/v1/user/timeout-status", {
          withCredentials: true,
        });
        setIsTimedOut(res.data.isTimedOut);
        console.log(res.data.isTimedOut);
      } catch (error) {
        console.error("Error checking user timeout status:", error);
      }
    };

    const timeoutCheckInterval = setInterval(() => {
      checkUserTimeoutStatus();
    }, 6000); // Check every minute

    return () => clearInterval(timeoutCheckInterval); // Cleanup the interval on component unmount
  }, [isAuthenticated]); // Run the effect when isAuthenticated changes

  const handleLogout = () => {
    console.log(isTimedOut);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    window.location.href = '/'
  }

  if (isTimedOut) {
    alert("You have been timed out. Please log in again.");
    handleLogout();
  }


  // //const auth = React.useContext(Context);
  // console.log(isAuthenticated);

  let unsafeQueries=0;
  const handleSubmit = async () => {
    let sc = 0
    const textpromp = {
      role: "user",
      messages: input,
      score: riskScore
    }
    // console.log(textpromp.messages);

    // sendChatRequest(textpromp.role, textpromp.messages)

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
        setRiskScore(result)
        setQueryScore(prompt.score)
        unsafeQueries=prompt.score
        

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
   
      const sendChatRequest = async (role, message, unsafeQueries) => {
        console.log(unsafeQueries)
        const res = 
          await axios
            .post(
              "http://localhost:7000/api/v1/user/new",
              { id:"", role, message,unsafeQueries},
              {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            );
            if (res.status !== 200) {
              throw new Error("Unable to send chat");
            }
            const data = await res.data;
            console.log(data)
            return data;
      };
    
     

    sendChatRequest(textpromp.role, textpromp.messages,unsafeQueries)

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


  // useEffect(() => {
  //   // Check user's timed-out status on component mount
  //   const checkTimedOutStatus = async () => {
  //     try {
  //       const response = await axios.get("/api/user/me"); // Replace with your backend endpoint
  //       const userData = response.data.user;
  //       if (userData && userData.timedOut) {
  //         setIsLoggedIn(false); // Set isLoggedIn to false if user is timed out
  //         // Show toast message
  //         toast.error("You have been timed out. Please log in again.");
  //       }
  //     } catch (error) {
  //       console.error("Error checking timed-out status:", error);
  //     }
  //   };

  //   checkTimedOutStatus();
  // }, []);

  

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
