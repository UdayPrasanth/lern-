import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { courses as mockCourses } from './lesson';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // To use mock data, set it directly
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Courses</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) :
        courses.length === 0 ? <Typography>No courses yet.</Typography> :
          <Grid container spacing={4}>
            {courses.map(c => (
              <Grid item key={c._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea component={Link} to={`/courses/${c._id}`} sx={{ flexGrow: 1 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={c.image || "https://via.placeholder.com/300x140.png?text=No+Image"}
                      alt={c.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">{c.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{c.description}</Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Instructor: {c.author?.name || 'N/A'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
      }
    </Box>
  );
}

export default CoursesPage;