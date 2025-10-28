import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { courses } from './lesson';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import Quiz from '../components/Quiz';
import StudentProgress from '../components/StudentProgress';
import AdminQuizEditor from '../components/AdminQuizEditor';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const course = courses.find(c => c._id === id);

  if (!course) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 4 }}>
          Course not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {course.description}
        </Typography>

        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', mb: 4 }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={course.videoUrl}
            title={course.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        {user?.role === 'student' && course.quiz && (
          <Quiz questions={course.quiz} courseId={course._id} />
        )}

        {user?.role === 'instructor' && (
          <StudentProgress courseId={course._id} />
        )}
        {user?.role === 'instructor' && <AdminQuizEditor courseId={course._id} />}
      </Paper>
    </Container>
  );
};

export default CourseDetails;