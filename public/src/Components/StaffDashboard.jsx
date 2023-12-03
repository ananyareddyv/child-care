import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StaffSign from './StaffSign';
import SalaryInsights from './SalaryInsights';
import WeeklyAttendance from './WeeklyAttendance';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../Data/firebase';
import { Button } from '@mui/material';
import ChildLedger from './ChildLedger';
import StaffLedger from './StaffLedger';

const drawerWidth = 240;

const views = [

  { text: 'Attendance', icon: <AssignmentIcon /> },
  { text: 'View Salary', icon: <PaymentIcon /> },
  { text: 'Ledger', icon: <ReceiptIcon /> },
];

const StaffDashboard = () => {
  const [selectedView, setSelectedView] = useState(views[0]);
  const [userData, setUserData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const auth = getAuth(app);
  const user = auth.currentUser;
  console.log(user.email)
  const db = getFirestore(app);

  const fetchData = async () => {
    const userDocRef = doc(db, 'users', user.email);

    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        setUserData(userData);
        setDataLoaded(true);
      } else {
        console.error('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [db, user.email]);

  const handleViewClick = (view) => {
    setSelectedView(view);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {views.map((view, index) => (
            <ListItem key={view.text} disablePadding>
              <ListItemButton onClick={() => handleViewClick(view)}>
                <ListItemIcon>{view.icon}</ListItemIcon>
                <ListItemText primary={view.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginTop: '64px', // Adjust for the app bar
           // Adjust for the drawer
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 3 }}>
          <Typography variant="h4">Welcome, {dataLoaded&&userData['firstName']}  !</Typography>
        </Box>

        {dataLoaded&&<StaffSign userData={userData} />}

        {selectedView.text === 'Attendance' && <WeeklyAttendance userData={userData} />}
        {selectedView.text === 'View Salary' && <SalaryInsights userData={userData} />}
        {selectedView.text === 'Ledger' && <StaffLedger user={user.email}/>}
      </Box>
    </Box>
  );
};

export default StaffDashboard;