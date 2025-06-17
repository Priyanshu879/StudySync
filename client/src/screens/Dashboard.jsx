import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { CalendarMonth, NoteAdd, Feedback, Group, HowToVote } from "@mui/icons-material";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-gray-50 py-10 px-4">
      <Typography variant="h4" align="center" gutterBottom className="text-blue-700 font-bold">
        StudySync Host Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center" className="mt-4">
        {/* Session Creation & Slot Proposal */}
        <Grid item xs={12} md={10} lg={8}>
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-indigo-600 font-semibold">
                📅 Session Management
              </Typography>
              <Divider className="mb-4" />
              <Typography variant="body1" gutterBottom>
                Create sessions, define topics, invite participants, and finalize time slots via collaborative voting.
              </Typography>
              <Box className="flex flex-wrap gap-4 mt-4">
                <Button
                  variant="contained"
                  startIcon={<NoteAdd />}
                  onClick={() => navigate("/create-session")}
                >
                  Create Session
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HowToVote />}
                  onClick={() => navigate("/manage-slots")}
                >
                  Manage Slots & Voting
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Library */}
        <Grid item xs={12} md={5}>
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-indigo-600 font-semibold">
                📚 Resource Library
              </Typography>
              <Divider className="mb-4" />
              <Typography variant="body1">
                Upload or view session-specific materials like notes, PDFs, and links.
              </Typography>
              <Box className="mt-4">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/resources")}
                >
                  Access Resources
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Integration */}
        <Grid item xs={12} md={5}>
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-indigo-600 font-semibold">
                📆 Calendar Integration
              </Typography>
              <Divider className="mb-4" />
              <Typography variant="body1">
                View all your scheduled sessions and sync with your Google Calendar.
              </Typography>
              <Box className="mt-4">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/calendar")}
                >
                  View Calendar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Feedback & Analytics */}
        <Grid item xs={12} md={10}>
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-indigo-600 font-semibold">
                📈 Feedback & Analytics
              </Typography>
              <Divider className="mb-4" />
              <Typography variant="body1">
                Collect session feedback and visualize data trends including frequency of topics, durations, and ratings.
              </Typography>
              <Box className="mt-4 flex gap-4">
                <Button
                  variant="outlined"
                  startIcon={<Feedback />}
                  onClick={() => navigate("/feedback")}
                >
                  View Feedback
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/analytics")}
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
