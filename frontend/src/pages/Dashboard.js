import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [courseCount, setCourseCount] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Enrollments',
        data: [12, 19, 3, 5, 2, 3], // Placeholder data
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    if (user) {
      // Fetch course stats from the new backend endpoint
      fetch(`${API}/courses/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCourseCount(data.count))
        .catch(err => console.error('Error fetching course count:', err));
    }
  }, [user, token]);

  useEffect(() => {
    // This is a placeholder for when you create the backend endpoint
    /*
    fetch(`${API}/stats/enrollments`)
      .then(res => res.json())
      .then(data => setEnrollmentData(data));
    */
  }, []);

  const chartData = {
    labels: [user?.role === 'instructor' ? 'Courses Created' : 'Courses Enrolled'],
    datasets: [
      {
        label: 'Total',
        data: [courseCount],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Your Course Statistics' },
    },
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Role: <strong>{user?.role}</strong>
      </Typography>

      {user?.role === 'instructor' && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6">Instructor Tools</Typography>
          <Button component={Link} to="/analytics" variant="contained" color="secondary" sx={{ mt: 1 }}>
            View Student Analytics
          </Button>
        </Paper>
      )}

      <Grid container spacing={3} sx={{ mb: 3, mt: 1, gap: '2rem' }}>
        <Grid item xs={12} md={5}>
          <Box sx={{ width: '100%', maxWidth: '400px' }}>
            <Bar options={chartOptions} data={chartData} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '600px', marginTop: '2rem' }}>
            <Line data={enrollmentData} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: '2rem', display: 'flex', gap: '1rem' }}>
        {user?.role === 'instructor' && (
          <Button component={Link} to="/add-course" variant="contained">Add New Course</Button>
        )}
        <Button component={Link} to="/courses" variant="outlined">View Courses</Button>
        <Button component={Link} to="/profile" variant="outlined">Edit Profile</Button>
      </Box>
    </Box>
  );
};

export default DashboardPage;