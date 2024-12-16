import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { Navigate } from "react-router-dom";

const routes = (
  <Router>
    <Routes>

      {/* Redirect root path "/" to "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
    </Routes>
  </Router>
);

export default function App() {
  return <div>{routes}</div>;
}
