import React, { useState, useEffect } from "react";
import "../App.css";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="cover-logo-container">
              <img className="cover-logo" src="./images/Logo.png" alt="" />
            </div>
            <Link to="/" onClick={closeMobileMenu} className="navbar-name">
              The Game Changers
            </Link>
          </div>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/upcoming-events"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Your Upcoming Events
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-links-mobile" onClick={userSignOut}>
                Sign Out
              </Link>
            </li>
          </ul>
          {button && (
            <Button onClick={userSignOut} buttonStyle="btn--outline">
              Sign Out
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
