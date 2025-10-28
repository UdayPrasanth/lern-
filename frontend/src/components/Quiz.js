import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemText, Paper, LinearProgress } from '@mui/material';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const Quiz = ({ questions, courseId }) => {
  const { user, token } = useAuth();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (selectedIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[current] = selectedIndex;
    setAnswers(updatedAnswers);
  };

  const submitResults = async () => {
    const finalScore = answers.reduce((acc, ans, i) =>
      ans === questions[i].answer ? acc + 1 : acc, 0);

    setScore(finalScore);
    setSubmitted(true);

    try {
      await fetch(`${API}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user._id, courseId, answers, score: finalScore })
      });
      toast.success('Quiz submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit quiz results.');
      console.error(err);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitResults();
    }
  };

  if (submitted) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Quiz Complete!</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          You scored {score} / {questions.length}
        </Typography>
      </Paper>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Question {current + 1} of {questions.length}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>{q.question}</Typography>
      <List>
        {q.options.map((opt, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton
              selected={answers[current] === i}
              onClick={() => handleAnswer(i)}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText primary={opt} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={answers[current] === null}
        >
          {current === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default Quiz;