import React from "react";
import "../nav.scss";
import { useNavigate } from "react-router";

const Nav = () => {
  const navigate = useNavigate();
  return (
    <nav className="nav-bar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }} onClick={() => navigate("/")}>
        <p style={{ margin: 0 }}>Insta</p>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="url(#insta-grad)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="insta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </div>
      <button onClick={() => navigate("/create-post")} className="button primary-btn">new post</button>
    </nav>
  );
};

export default Nav;
