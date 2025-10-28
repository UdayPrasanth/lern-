import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const AddCoursePage = () => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  if (user?.role !== 'instructor') {
    return <Typography color="error">Access denied. Only instructors can add courses.</Typography>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${API}/courses`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add course');
      }

      toast.success('Course added successfully!');
      navigate('/'); // Redirect to courses page
    } catch (err) {
      toast.error(err.message);
      console.error('Error adding course:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h2" gutterBottom>Add a New Course</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Course Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </Button>
          {image && <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>{image.name}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Add Course</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCoursePage;