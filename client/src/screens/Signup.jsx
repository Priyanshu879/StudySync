import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", formData, {
        withCredentials: true,
      });
      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100">
      <Paper
        elevation={8}
        className="p-10 w-full max-w-lg rounded-2xl shadow-xl transition-transform transform hover:scale-[1.01]"
      >
        <Typography
          variant="h4"
          className="mb-6 text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Join StudySync
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TextField
            name="email"
            label="Email Address"
            type="email"
            required
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="username"
            label="Username"
            required
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            required
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="!bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-200"
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </Typography>
        </form>
      </Paper>
    </div>
  );
};

export default Signup;
