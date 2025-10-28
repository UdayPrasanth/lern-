import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Divider } from '@mui/material';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const ManageStudentsPage = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'instructor') {
    return <Typography color="error">Access denied. Only instructors can manage students.</Typography>;
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/admin/students`, {
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
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>Manage Students</Typography>
      <Paper>
        <List>
          {students.length > 0 ? students.map((student, index) => (
            <React.Fragment key={student._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={student.profileImage}>{student.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={student.name} secondary={student.email} />
              </ListItem>
              {index < students.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          )) : <Typography sx={{ p: 2 }}>No students have registered yet.</Typography>}
        </List>
      </Paper>
    </Box>
  );
};

export default ManageStudentsPage;