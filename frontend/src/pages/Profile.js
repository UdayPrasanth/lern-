import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Paper, CircularProgress, TextField, Button, Grid, Container } from '@mui/material';
import ProfileImageUpload from '../components/ProfileImageUpload';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

const ProfilePage = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${API}/profile/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setFormData(data);
        } catch (err) {
          console.error("Failed to fetch profile", err);
          toast.error("Failed to load profile.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    // Append all form data fields to the payload
    Object.entries(formData).forEach(([key, value]) => {
      // Don't append fields that shouldn't be sent, like _id or email
      if (value && !['_id', 'email', 'role', 'courses', 'enrollments', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        payload.append(key, value);
      }
    });

    try {
      const res = await fetch(`${API}/profile/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }
      const result = await res.json();
      setFormData(result); // Update state with new profile data from server
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!formData) return <Typography>Could not load profile.</Typography>;

  return (
    <Container maxWidth="md" sx={{ padding: '2rem' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" component="h2" gutterBottom>Your Profile</Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileImageUpload
                onImageChange={handleImageChange}
                existingImageUrl={typeof formData.profileImage === 'string' ? formData.profileImage : null}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" name="name" value={formData.name || ''} onChange={handleChange} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" name="email" value={formData.email || ''} disabled margin="normal" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Bio" name="bio" value={formData.bio || ''} onChange={handleChange} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Country" name="country" value={formData.country || ''} onChange={handleChange} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" name="city" value={formData.city || ''} onChange={handleChange} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="LinkedIn URL" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} margin="normal" />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">Save Changes</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;