import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { MdAddModerator } from "react-icons/md";
import { MdRule } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdRule } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
    const [show, setShow] = useState(false);
  
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
    const handleLogout = async () => {
      await axios
      .get("http://localhost:7000/api/v1/user/admin/logout",{
        withCredentials: true,
    })
    .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };
  const gotoRulePage = () => {
    navigateTo("/rules");
    setShow(!show);
  };
  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <MdAddModerator onClick={gotoAddNewAdmin} />
          <AiFillMessage onClick={gotoMessagesPage} />
          <MdRule onClick={gotoRulePage}/>
          <RiLogoutBoxFill onClick={handleLogout} />
          </div>
        </nav>
      
      {isAuthenticated && (
        <div className="wrapper" style={{ display: "flex" }}>
          <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;