import React from "react";
import MainMenu from "./MainMenu";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <>
      <MainMenu />
      {children}
    </>
  );
};

export default Layout;
