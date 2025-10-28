import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, TextField, Button, IconButton, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const AdminQuizEditor = ({ courseId }) => {
  const { token } = useAuth();
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    fetch(`${API}/admin/quizzes/${courseId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setQuiz(data || []));
  }, [courseId, token]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[qIndex].options[oIndex] = value;
    setQuiz(updatedQuiz);
  };

  const addQuestion = () => {
    setQuiz([...quiz, { question: '', options: ['', ''], answer: 0, explanation: '' }]);
  };

  const deleteQuestion = (index) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  const updateQuiz = async () => {
    try {
      await fetch(`${API}/admin/quizzes/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quiz })
      });
      toast.success('Quiz saved successfully!');
    } catch (err) {
      toast.error('Failed to save quiz.');
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Quiz</Typography>
      {quiz.map((q, qIndex) => (
        <Paper key={qIndex} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField fullWidth label={`Question ${qIndex + 1}`} value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} />
            </Grid>
            {q.options.map((opt, oIndex) => (
              <Grid item xs={12} sm={6} key={oIndex}>
                <TextField fullWidth label={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} />
              </Grid>
            ))}
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Correct Answer</InputLabel>
                <Select value={q.answer} label="Correct Answer" onChange={e => handleQuestionChange(qIndex, 'answer', e.target.value)}>
                  {q.options.map((_, i) => <MenuItem key={i} value={i}>{`Option ${i + 1}`}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <IconButton onClick={() => deleteQuestion(qIndex)} color="error"><DeleteIcon /></IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Explanation" value={q.explanation} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} />
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={addQuestion} sx={{ mr: 2 }}>Add Question</Button>
      <Button variant="contained" onClick={updateQuiz}>Save Quiz</Button>
    </Paper>
  );
};

export default AdminQuizEditor;