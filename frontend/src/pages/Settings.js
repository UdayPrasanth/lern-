import React, { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Divider, FormControlLabel, Switch } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const SettingsPage = () => {
  const { token, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      toast.success(data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action is permanent and cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      toast.success(data.message || 'Account deleted successfully');
      logout(); // Log the user out
      navigate('/login'); // Redirect to login page
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ p: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Settings
      </Typography>

      {/* Theme Toggle Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="label" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
          Appearance
        </Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
          label="Dark Mode"
        />
      </Paper>

      {/* Change Password Section */}
      <Paper component="form" onSubmit={handlePasswordChange} sx={{ p: 3, mb: 4 }}>
        <Box className="setting-group" sx={{ mb: 2 }}>
          <Typography variant="h6" component="label" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Change Password
          </Typography>
          <TextField
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </Box>
        <Button type="submit" variant="contained">Update Password</Button>
      </Paper>

      <Divider />

      {/* Delete Account Section */}
      <Paper sx={{ p: 3, mt: 4, border: '1px solid', borderColor: 'error.main' }}>
        <Typography variant="h6" component="label" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Deleting your account is permanent and cannot be undone.
        </Typography>
        <Button variant="contained" color="error" onClick={handleDeleteAccount}>
          Delete My Account
        </Button>
      </Paper>
    </Container>
  );
};

export default SettingsPage;