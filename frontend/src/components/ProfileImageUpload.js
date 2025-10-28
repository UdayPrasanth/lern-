import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';

const ProfileImageUpload = ({ onImageChange, existingImageUrl }) => {
  const [preview, setPreview] = useState(existingImageUrl);

  useEffect(() => {
    // Update preview if the existing image URL changes (e.g., after saving)
    setPreview(existingImageUrl);
  }, [existingImageUrl]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the preview
      setPreview(URL.createObjectURL(file));
      // Pass the file object up to the parent form
      onImageChange(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={preview}
        sx={{ width: 100, height: 100 }}
      >
        {!preview && <Typography>P</Typography>}
      </Avatar>
      <Button variant="contained" component="label">
        Change Picture
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageSelect}
        />
      </Button>
    </Box>
  );
};

export default ProfileImageUpload;