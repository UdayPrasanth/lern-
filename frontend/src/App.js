import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Container } from '@mui/material';
import Sidebar from './components/sidebar';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import CoursesPage from './pages/Courses';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import ManageStudentsPage from './pages/ManageStudents';
import LoginPage from './pages/LoginPage';
import CourseDetails from './pages/CourseDetails';
import RegisterPage from './pages/RegisterPage'; // Assuming you'll create this file too
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AddCoursePage from './pages/AddCourse.js';

function App() {
  const { user, logout } = useAuth();
  return (
    <>
      {user && <Sidebar />}
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar user={user} logout={logout} />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><ManageStudentsPage /></ProtectedRoute>} />
          <Route path="/add-course" element={<ProtectedRoute><AddCoursePage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        </Routes>
      </Container>
    </>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
