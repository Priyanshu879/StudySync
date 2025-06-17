import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import CreateSession from "./screens/CreateSession";
import ManageSlots from "./screens/ManageSlots";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* Future routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-session" element={< CreateSession/>} />
        <Route path="/manage-slots" element={< ManageSlots/>} />
        <Route path="*" element={<div className="text-center mt-10 text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
