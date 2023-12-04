import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../Data/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { Grid, TextField, Paper, Box, CircularProgress, Button, AppBar, Toolbar, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../Images/Login.jpg';
import FacilityAdminUI from './FacilityAdministrator';
import ParentDashboard from './ParentDashboard';
import StaffDashboard from './StaffDashboard';
import SystemAdmin from './SystemAdmin';

const Container = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '64px', // Adjust this value to create space for the AppBar
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
}));

// ... (imports)

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errmsg, setErrmsg] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState();

  const inputStyle = { width: '100%', marginBottom: '20px' };
  const buttonStyle = { width: '100%', marginBottom: '20px' };

  const handleLogin = async () => {
    setLoading(true);

    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const authUser = auth.currentUser;
      console.log('User logged in:', authUser);

      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        Cookies.set('userRole', userRole, { expires: 7 });
        setUserRole(userRole)

        // Set the logged in state to true
        setLoggedIn(true);
      } else {
        console.error('User document not found.');
        setErrmsg('Invalid email/password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrmsg('Invalid email/password');
    } finally {
      setLoading(false);
    }
  };

  // If the user is logged in, don't render the login form
  if (loggedIn) {
    return (
      <Container>
        {/* Render the user-specific component based on user's role */}
        {userRole === 'FA' && <FacilityAdminUI />}
        {userRole === 'parents' && <ParentDashboard />}
        {userRole === 'teacher' && <StaffDashboard />}
        {userRole === 'SA' && <SystemAdmin />}
      </Container>
    );
  }

  return (
    <Container>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div">
            Your App Name
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid item xs={12} sm={6}>
        <Item>
          <h2>Login</h2>
          <TextField
            type="text"
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <TextField
            type="password"
            label="Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          {errmsg && <Alert severity="error">{errmsg}</Alert>}
        </Item>
      </Grid>
    </Container>
  );
}

export default Login;
