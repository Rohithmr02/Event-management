import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaBars } from "react-icons/fa";

const Navbar = ({ token }) => {
  const [classname, setClassName] = useState("nav-links");
  const [value, setValue] = useState(true);
  const { user } = useAuth();
  const { logout } = useAuth();

  const HandleLogoutButton = () => {
    logout();
    window.location.href = "/";
  };

  const HandleBarButton = () => {
    setValue(!value);
    setClassName(value ? "nav-links show" : "nav-links");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/dashboard">Eventify</Link>
      </div>
      <ul className={classname}>
        {token ? (
          <>
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/create-event">Create Event</Link>
            </li>
            {user ? <li><span>Welcome {user?.name}</span></li> : ""}
            <li>
              <Link to="/" className="login-btn" onClick={HandleLogoutButton}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" className="login-btn">Login</Link>
            </li>
            <li>
              <Link to="/register" className="login-btn">Register</Link>
            </li>
          </>
        )}
      </ul>
      <div className="bar">
        <button onClick={HandleBarButton}>
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
