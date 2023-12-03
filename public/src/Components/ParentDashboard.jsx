import * as React from 'react';
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
import ChildProfile from './ChildProfile';
import Attendance from './Attendance';
import PaymentRequest from './PaymentRequest';
import ChildLedger from './ChildLedger';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../Data/firebase';

const drawerWidth = 240;

const views = [
  { text: 'Child Profile', icon: <ChildCareIcon />, component: <ChildProfile /> },
  { text: 'Attendance', icon: <AssignmentIcon />, component: <Attendance /> },
  { text: 'Payment Request', icon: <PaymentIcon />, component: <PaymentRequest /> },
  { text: 'Child Ledger', icon: <ReceiptIcon />, component: <ChildLedger /> },
];

export default function PermanentDrawerLeft() {
  const [selectedView, setSelectedView] = React.useState(views[0]);
  const [userData, setUserData] = React.useState(null);
  const [dataLoaded,setDataLoaded]=React.useState(false);

  const fetchData = async () => {
    const auth = getAuth(app);
    const authUser = auth.currentUser;

    if (authUser) {
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', authUser.email);

      try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() };
          setUserData(userData);
          setDataLoaded(true)
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleViewClick = (view) => {
    setSelectedView(view);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Child Care Management System - Child Profile
          </Typography>
        </Toolbar>
      </AppBar>
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
  sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '90px' }}
>

        {dataLoaded&&(selectedView.component && React.cloneElement(selectedView.component, { userData }))}
      </Box>
    </Box>
  );
}
