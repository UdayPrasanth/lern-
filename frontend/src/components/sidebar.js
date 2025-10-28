import React, { useState } from 'react';
import './sidebar.css';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // get user role and logout

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Courses', path: '/' },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ];

  const instructorItems = [
    { label: 'Manage Students', path: '/students' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="sidebar-container">
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      {isOpen && (
        <div className="sidebar">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} onClick={handleLinkClick}>
                <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
              </li>
            ))}
            {user?.role === 'instructor' &&
              instructorItems.map((item, index) => (
                <li key={`inst-${index}`} onClick={handleLinkClick}>
                  <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </li>
              ))}
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;