import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [courseAverages, setCourseAverages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API}/analytics/course-averages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const chartData = {
          labels: data.map(d => d.courseTitle),
          datasets: [{
            label: 'Average Score',
            data: data.map(d => d.avgScore),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        };
        setCourseAverages(chartData);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Quiz Score by Course',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Score'
        }
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {courseAverages && courseAverages.labels.length > 0 ? (
              <Bar options={chartOptions} data={courseAverages} />
            ) : (
              <Typography>No quiz data available to display course averages.</Typography>
            )}
          </Paper>
        </Grid>
        {/* You can add more charts here, like student-specific progress */}
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;