import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import API_URL from '../apiConfig'; // Use the centralized API URL
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Divider, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageStudentsPage = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (user?.role !== 'instructor') {
    return <Typography color="error">Access denied. Only instructors can manage students.</Typography>;
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>Manage Students</Typography>
      <Paper elevation={3}>
        <List>
          {students.length > 0 ? students.map((student, index) => (
            <React.Fragment key={student._id}>
              <ListItemButton onClick={() => navigate(`/students/${student._id}`)}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={student.profileImage}>{student.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={`Joined: ${new Date(student.createdAt).toLocaleDateString()}`}
                  />
                </ListItem>
              </ListItemButton>
              {index < students.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          )) : <Typography sx={{ p: 3, textAlign: 'center' }}>No students have registered yet.</Typography>}
        </List>
      </Paper>
    </Box>
  );
};

export default ManageStudentsPage;