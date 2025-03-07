import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="anihub-navbar">
      <Link to="/">ANIHUB</Link>
      <div className="anihub-navbar-user">
        <img src="https://res.cloudinary.com/jerrick/image/upload/v1692579471/64e2b68ec73d2d001d0cab48.jpg" alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
