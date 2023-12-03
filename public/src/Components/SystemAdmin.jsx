import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import ClassIcon from '@mui/icons-material/Class';
import StaffAttendance from './StaffAttendance';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../Data/firebase';
import Classroom from './Classrooms';
import AbsenteesReport from './AbsentReport';

const drawerWidth = 240;

const DrawerItem = ({ text, icon, onClick }) => (
  <ListItem disablePadding>
    <ListItemButton onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  </ListItem>
);

const SystemAdmin = () => {
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [parentUsers, setParentUsers] = useState([]);
  const [selectedSection, setSelectedSection] = useState('generic');
  const [classrooms, setClassrooms] = useState([]);

  const [userData,setUserData]=useState([]);
  useEffect(() => {
    const fetchClassroomData = async () => {
      const db = getFirestore(app);
      const classroomsCollectionRef = collection(db, 'classrooms');
  
      try {
        const classroomsSnapshot = await getDocs(classroomsCollectionRef);
        const classroomsData = classroomsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        setClassrooms(classroomsData);
        console.log(classroomsData)
      } catch (error) {
        console.error('Error fetching classroom data:', error.message);
      }
    };
    const fetchUsersData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const usersCollectionRef = collection(db, 'users');
  
      try {
        const querySnapshot = await getDocs(usersCollectionRef);
        
        if (!querySnapshot.empty) {
          const allUsersData = [];
          
          querySnapshot.forEach((doc) => {
            const userData = { id: doc.id, ...doc.data() };
            allUsersData.push(userData);
          });
          console.log(allUsersData)
  
          setUserData(allUsersData);
          const teacherUsers = allUsersData.filter(user => user.role === 'teacher');
          const parentUsers = allUsersData.filter(user => user.role === 'parents');
          console.log(teacherUsers);
          
          setTeacherUsers(teacherUsers);
          setParentUsers(parentUsers);
        } else {
          console.log('No documents found in the users collection.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUsersData();
    fetchClassroomData();
  }, []);

  const handleSectionClick = (section) => {
    console.log(section)
    setSelectedSection(section);
  };
  

  const renderSection = () => {
    switch (selectedSection) {
      case 'employeeAttendance':
        return <StaffAttendance userData={teacherUsers}  role={"teacher"} />;
      case 'childAttendance':
        return <StaffAttendance userData={parentUsers} role={"parent"}/>;
      case 'Classrooms':
        return <Classroom classrooms={classrooms}/>;
      case 'Absent':
        return <AbsenteesReport userData={userData}/>
        
      // Add more cases for other sections if needed
      default:
        return (
          <div>
            <h2>Generic Content Section</h2>
            <p>This is where your generic content goes.</p>
          </div>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <DrawerItem text="Employee Attendance" icon={<AssignmentIcon />} onClick={() => handleSectionClick('employeeAttendance')} />
            <DrawerItem text="Child Attendance" icon={<PeopleIcon />} onClick={() => handleSectionClick('childAttendance')} />
            <DrawerItem text="Absent Report" icon={<DescriptionIcon />} onClick={() => handleSectionClick('Absent')} />
            <DrawerItem text="Classrooms" icon={<ClassIcon />} onClick={() => handleSectionClick('Classrooms')} />
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>{renderSection()}</Typography>
      </Box>
    </Box>
  );
};

export default SystemAdmin;
