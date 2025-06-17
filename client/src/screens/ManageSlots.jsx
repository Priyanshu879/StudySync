import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Grid,
  TextField,
  Chip,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AccessTime, CheckCircle, HowToVote } from "@mui/icons-material";

const ManageSlots = ({ sessionId }) => {
  const [loading, setLoading] = useState(true);
  const [proposedSlots, setProposedSlots] = useState([]);
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const [newSlot, setNewSlot] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  // Fetch slots & confirmed slot
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:4000/api/sessions/${sessionId}/slots`,
        { withCredentials: true }
      );
      setProposedSlots(data.proposedSlots || []);
      setConfirmedSlot(data.confirmedSlot || null);
    } catch (err) {
      alert("Failed to load slots: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    fetchSlots();
  }, [sessionId]);

  // Add a new slot
  const handleAddSlot = async () => {
    if (!newSlot) {
      alert("Please select a date and time.");
      return;
    }
    try {
      setAddingSlot(true);
      await axios.post(
        `http://localhost:4000/api/sessions/${sessionId}/slots`,
        { date: new Date(newSlot).toISOString() },
        { withCredentials: true }
      );
      setNewSlot("");
      fetchSlots();
    } catch (err) {
      alert("Failed to add slot: " + (err.response?.data?.message || err.message));
    } finally {
      setAddingSlot(false);
    }
  };

  // Vote for a slot
  const handleVote = async (slotId) => {
    try {
      setVotingLoading(true);
      await axios.post(
        `http://localhost:4000/api/sessions/${sessionId}/slots/${slotId}/vote`,
        {},
        { withCredentials: true }
      );
      fetchSlots();
    } catch (err) {
      alert("Failed to vote: " + (err.response?.data?.message || err.message));
    } finally {
      setVotingLoading(false);
    }
  };

  // Notify participants
  const handleNotify = async () => {
    try {
      setNotifyLoading(true);
      await axios.post(
        `http://localhost:4000/api/sessions/${sessionId}/notify`,
        {},
        { withCredentials: true }
      );
      alert("Participants notified successfully.");
    } catch (err) {
      alert("Failed to notify participants: " + err.message);
    } finally {
      setNotifyLoading(false);
    }
  };

  if (loading)
    return (
      <Box className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <Paper elevation={4} className="max-w-5xl mx-auto p-6 rounded-2xl bg-white">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="text-blue-800 font-bold"
        >
          🗓️ Manage Session Slots & Voting
        </Typography>

        <Grid container spacing={6} justifyContent="center" className="mt-6">
          {/* Propose Slots */}
          <Grid item xs={12} md={10}>
            <Card className="shadow-xl rounded-2xl">
              <CardContent>
                <Typography variant="h6" className="text-indigo-600 font-semibold">
                  Propose New Time Slots
                </Typography>
                <Divider className="my-3" />
                <Typography variant="body2" color="textSecondary">
                  Hosts and participants can suggest potential timings for the session. All slots will be visible to participants for voting.
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={3}>
                  <TextField
                    type="datetime-local"
                    label="New Slot"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AccessTime />}
                    sx={{ minWidth: "160px", height: "56px", bgcolor: "#1976d2" }}
                    onClick={handleAddSlot}
                    disabled={addingSlot}
                  >
                    {addingSlot ? "Adding..." : "Add Slot"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Voting Section */}
          <Grid item xs={12} md={10}>
            <Card className="shadow-xl rounded-2xl">
              <CardContent>
                <Typography variant="h6" className="text-indigo-600 font-semibold">
                  🗳️ Vote on Proposed Slots
                </Typography>
                <Divider className="my-3" />
                <Typography variant="body2" color="textSecondary">
                  Participants can vote for their preferred slots. Most voted slot will be finalized.
                </Typography>
                <Stack spacing={2} mt={3}>
                  {proposedSlots.length === 0 && (
                    <Typography>No proposed slots yet.</Typography>
                  )}
                  {proposedSlots.map((slot, i) => (
                    <Box
                      key={slot._id || i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border shadow-sm"
                    >
                      <Typography variant="body1" className="font-medium">
                        {new Date(slot.date).toLocaleString()}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={`${slot.votes || 0} votes`} color="primary" />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<HowToVote />}
                          onClick={() => handleVote(slot._id)}
                          disabled={votingLoading}
                        >
                          Vote
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Confirmed Slot */}
          {confirmedSlot && (
            <Grid item xs={12} md={10}>
              <Card className="shadow-xl rounded-2xl border-2 border-green-600">
                <CardContent>
                  <Typography variant="h6" className="text-green-700 font-semibold">
                    ✅ Confirmed Slot
                  </Typography>
                  <Divider className="my-3" />
                  <Typography variant="h5" className="text-green-800 font-semibold">
                    {new Date(confirmedSlot.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mt-1">
                    Finalized based on highest votes.
                  </Typography>
                  <Box className="mt-4 text-center">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={handleNotify}
                      disabled={notifyLoading}
                    >
                      {notifyLoading ? "Notifying..." : "Notify Participants"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ManageSlots;
