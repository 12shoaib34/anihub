import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../screens/home/home";
import Anime from "../screens/anime/anime";
import { Navbar } from "../app-ui";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="anime" element={<Anime />} />
      </Routes>
    </>
  );
};

export default Layout;
