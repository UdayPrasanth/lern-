import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const FeedbackForm = ({ open, handleClose, studentEmail, studentName }) => {
  const { token } = useAuth();
  const [message, setMessage] = useState('');

  const sendFeedback = async () => {
    try {
      await fetch(`${API}/email/send-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          to: studentEmail,
          subject: 'Feedback on your recent quiz',
          message
        })
      });
      toast.success(`Feedback sent to ${studentName}`);
      handleClose();
      setMessage('');
    } catch (err) {
      toast.error('Failed to send feedback.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Send Feedback to {studentName}</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button variant="contained" onClick={sendFeedback}>Send Feedback</Button>
      </Box>
    </Modal>
  );
};

export default FeedbackForm;