import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateSession = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    participants: "",
  });

  const handleChange = (e) => {
    setSessionData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: sessionData.title,
        description: sessionData.description,
        participants: sessionData.participants
          .split(",")
          .map((p) => p.trim()),
      };
      const res = await axios.post("http://localhost:4000/api/sessions", payload, {
        withCredentials: true,
      });
      alert("Session created successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating session");
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Paper elevation={6} className="p-8 w-full max-w-lg">
        <Typography
          variant="h5"
          className="mb-6 text-center font-bold text-blue-600"
        >
          Create a New Study Session
        </Typography>
        <Divider className="mb-6" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Session Title"
            name="title"
            value={sessionData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={sessionData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Participants (comma-separated user IDs)"
            name="participants"
            value={sessionData.participants}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Session
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateSession;
