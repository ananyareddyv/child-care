import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import Router
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Logo from './Images/Logo.jpg'
import FacilityAdminUI from './Components/FacilityAdministrator';
import NotFound from './Components/404';
import { useEffect } from 'react';
import { useState } from 'react';
import ParentDashboard from './Components/ParentDashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import StaffDashboard from './Components/StaffDashboard';
import SystemAdministrator from './Components/SystemAdmin';
import { AppBar, IconButton, Toolbar, Typography,Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check the role cookie or your preferred method to get the user's role
    const roleCookie = getRoleCookie(); // Replace with your actual logic

    // Update the userRole state
    setUserRole(roleCookie);
  }, []);

  return (
    <div>
            <AppBar position="fixed" style={{ zIndex: 1201 }}>

        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <img src='./Images/Logo.jpg'/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ABC Childcare Center
          </Typography>
          {location.pathname === '/' && (
              <Button variant="contained" href="/Login">
                Login <LoginIcon />
              </Button>
            )}
            {location.pathname !== '/' && location.pathname !== '/Login' && (
              <Button variant="contained"  href="/">
                Logout <LogoutIcon />
              </Button>
            )}
             {location.pathname == '/Login' && (
              <Button variant="contained"  href="/">
                Home <HomeIcon />
              </Button>
            )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {userRole === 'FA' && (
          <Route path="/facility-admin" element={<FacilityAdminUI />} />
        )}
        {userRole === 'parents' && (
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
        )}
        {userRole === 'teacher' && (
          <Route
            path="/staff-dashboard"
            element={
              <>
                <StaffDashboard />
                
              </>
            }
          />
        )}
        {userRole === 'SA' && (
          <Route path="/admin" element={<SystemAdministrator />} />
        )}
        <Route component={NotFound} />
      </Routes>
    </div>
  );
}
function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default MainApp; 
function getRoleCookie() {
  // Example: Read the role from cookies
  return document.cookie.replace(/(?:(?:^|.*;\s*)userRole\s*=\s*([^;]*).*$)|^.*$/, '$1');
}
