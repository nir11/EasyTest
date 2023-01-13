import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/EasyTestLogo - white.png";
import "./nav.css";

const MyNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();

  const pushTo = (path) => {
    navigate(path);
  };
  return (
    <Nav activeKey="/">
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setActiveIndex(0);
            pushTo("/");
          }}
          className={activeIndex === 0 ? "active-nav-item" : ""}
        >
          <span>קביעת תור </span>
          <i className="fas fa-calendar-check"></i>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setActiveIndex(1);
            pushTo("/manager");
          }}
          className={activeIndex === 1 ? "active-nav-item" : ""}
        >
          <span>פאנל מנהל </span>
          <i class="fas fa-user-cog"></i>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link
          onClick={() => {
            setActiveIndex(2);
            pushTo("/recommended");
          }}
          className={activeIndex === 2 ? "active-nav-item" : ""}
        >
          <span>תור לפי המלצה </span>
          <i className="fas fa-map-marker-alt"></i>
        </Nav.Link>
      </Nav.Item>
      <img className="nav-logo" src={logo} onClick={() => navigate("/")} />

      {/* <h2>EasyTest</h2> */}
    </Nav>
  );
};

export default MyNav;
