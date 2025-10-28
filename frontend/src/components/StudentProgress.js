import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Button } from '@mui/material';
import FeedbackForm from './FeedbackForm';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const StudentProgress = ({ courseId }) => {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API}/quiz/results/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch quiz results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [courseId, token]);

  const handleOpenFeedback = (result) => {
    setSelectedStudent(result.userId);
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackModalOpen(false);
    setSelectedStudent(null);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Student Progress</Typography>
        {results.length === 0 ? (
          <Typography>No students have submitted this quiz yet.</Typography>
        ) : (
          <List>
            {results.map((r, index) => (
              <React.Fragment key={r._id}>
                <ListItem secondaryAction={
                  <Button variant="outlined" size="small" onClick={() => handleOpenFeedback(r)}>Give Guidance</Button>
                }>
                  <ListItemText primary={r.userId?.name || 'Unknown User'} secondary={`Score: ${r.score}`} />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      {selectedStudent && (
        <FeedbackForm open={feedbackModalOpen} handleClose={handleCloseFeedback} studentEmail={selectedStudent.email} studentName={selectedStudent.name} />
      )}
    </>
  );
};

export default StudentProgress;