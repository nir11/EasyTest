import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/EasyTestLogo - white.png";
import "./nav.css";

const MyNav = () => {
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);

  const navigate = useNavigate();

  const pushTo = (path) => {
    navigate(path);
  };
  return (
    <Nav activeKey="/">
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setIsActive1((prevState) => !prevState);
            setIsActive2(false);
            pushTo("/");
          }}
          className={isActive1 ? "active-nav-item" : ""}
        >
          קביעת תור &nbsp;<i className="fas fa-calendar-check"></i>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setIsActive1(false);
            setIsActive2((prevState) => !prevState);
            pushTo("/manager");
          }}
          className={isActive2 ? "active-nav-item" : ""}
        >
          פאנל מנהל &nbsp;<i class="fas fa-user-cog"></i>
        </Nav.Link>
      </Nav.Item>
      {/* 
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setIsActive1(false);
            setIsActive2(!isActive2);
            pushTo("/recommended");
          }}
          className={isActive2 ? "active-nav-item" : ""}
        >
          {" "}
          המלצה לפי מיקום &nbsp;<i className="fas fa-map-marker-alt"></i>
        </Nav.Link>
      </Nav.Item> */}
      <img className="nav-logo" src={logo} onClick={() => navigate("/")} />

      {/* <h2>EasyTest</h2> */}
    </Nav>
  );
};

export default MyNav;
