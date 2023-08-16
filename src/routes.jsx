import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import User from "./pages/User/User";

const RoutesApp = ({ users }) => {
  return (
    <Routes>
      <Route path="/" element={<Main users={users} />}></Route>
      <Route path="/:cpf" element={<User users={users} />}></Route>
    </Routes>
  );
};

export default RoutesApp;
