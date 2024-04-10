import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Header from "./pages/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Rules from "./pages/Rules";
import Chat from "./pages/Chat";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <div className='gradient__bg'>
            <Navbar />
            {/* <Header /> */}
          
            <Routes>
              <Route path="/" element={<Header />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
             
              <Route path="/rules" element={<Rules />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
          {/* <Login /> */}
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
