import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  AppBar,
} from '@mui/material';
import Register from './Register';
import Withdraw from './Withdraw';
import { useEffect } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '../Data/firebase';
import { getAuth } from 'firebase/auth';
import EnrollTeacher from './EnrollTeacher';
import TerminateStaff from './TerminateStaff';
import ClassroomManagement from './ClassroomManagement';
import Classroom from './Classrooms';
import StaffAttendance from './StaffAttendance';
import AbsenteesReport from './AbsentReport';
import AgeCategoryReport from './AttendanceReport';
const FacilityAdminUI = () => {
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [classroomDialogOpen, setclassroomDialogOpen] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [withdrawalrequests,setWithdrawalrequests]=useState(false);
  const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, ''); 
  const [classrooms,setClassrooms]=useState(null);
  const [withdrawalUsers,setWithdrawalUsers]=useState([]);
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [parentUsers, setParentUsers] = useState([]);
  // ... other state and functions remain the same

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const usersCollectionRef = collection(db, 'users');

      try {
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Check and update currentDate.checkin for each user
        const updatedUsersData = usersData.map((user) => {
          if (!user[currentDate] || user[currentDate].checkin === undefined) {
            return {
              ...user,
              [currentDate]: { checkin: false },
            };
          }
          return user;
        });

        setAllUsers(updatedUsersData);
        const teacherUsers = updatedUsersData.filter(user => user.role === 'teacher');
          const parentUsers = updatedUsersData.filter(user => user.role === 'parents');
          console.log(teacherUsers);
          
          setTeacherUsers(teacherUsers);
          setParentUsers(parentUsers);
        setUsersLoaded(true);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
    fetchClassroomData()
  }, []); 

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
    } catch (error) {
      console.error('Error fetching classroom data:', error.message);
    }
  };
  

  const handleEnroll = () => {
    setEnrollDialogOpen(true);
  };


  const handleHire = () => {
    setHireDialogOpen(true);
  };

  const handleTerminate = () => {
    setTerminateDialogOpen(true);
  };

  const handleCloseDialogs = async () => {
    setEnrollDialogOpen(false);
    setWithdrawDialogOpen(false);
    setHireDialogOpen(false);
    setTerminateDialogOpen(false);
    setWithdrawalrequests(false);
    setclassroomDialogOpen(false);
    setReportDialogOpen(false);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, 'users');
  
    try {
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Update checkin field for each user
      const updatedUsersData = usersData.map((user) => {
        if (!user[currentDate] || user[currentDate].checkin === undefined) {
          // If currentDate field or checkin is not present, add it
          return {
            ...user,
            [currentDate]: { checkin: false },
          };
        }
        return user;
      });
  
      setAllUsers(updatedUsersData);
      
    } catch (error) {
      console.error('Error fetching and updating users:', error.message);
    }
  };
  
  const handleWithdrawalRequest= async () =>{
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, 'withdrawalrequests');

    try {
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWithdrawalUsers(usersData);
      console.log(usersData)
    } catch (error) {
      console.error('Error fetching updated users:', error.message);
    }
    setWithdrawalrequests(true);
  }
  const handleWithdrawComponent=()=>{
    setWithdrawDialogOpen(true);
  }
  const handleClassroom=()=>{
    setclassroomDialogOpen(true);
  }
  const handleClassroomClose=()=>{
    setclassroomDialogOpen(false);
    fetchClassroomData();
  }
  const handleWithdraw = async (parent) => {
    const db = getFirestore(app);
    const auth = getAuth(app);
    console.log(parent);

    try { // Start withdrawal loading

      // Delete the user document from the "users" collection
      const userDocRef = doc(db, 'users', parent.id);
      await deleteDoc(userDocRef);

      // Decrement count in Firestore based on age category
      const countsDocRef = doc(db, 'ageCounts', parent.ageCat);
      const countsDoc = await getDocs(countsDocRef);

      if (countsDoc.exists()) {
        const currentCount = countsDoc.data().count || 0;
        await setDoc(countsDocRef, { count: Math.max(currentCount - 1, 0) });
      }



      alert('User has been successfully withdrawn');

      console.log(`Withdraw user with ID: ${parent.id}`);
    } catch (error) {
      console.error('Error withdrawing user:', error.message);
    } 
  };
  const handleCheckin = async (userData) => {
    // Get the current date in the format 'MMDDYYYY'
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '');
  
    if (!userData[currentDate] || !userData[currentDate].checkin) {
      // If the user doesn't have a field for the current date or not checked in, create one
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', userData.id);
  
      try {
        await updateDoc(userDocRef, {
          [currentDate]: {
            checkin: true,
            checkinTime: new Date().toLocaleTimeString(), // Add check-in time
          },
        });
  
        // Fetch updated user data
        const updatedUserDoc = await getDoc(userDocRef);
        const updatedUserData = { id: updatedUserDoc.id, ...updatedUserDoc.data() };
  
        // Update the local state with the updated user data
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUserData.id ? updatedUserData : user))
        );
        alert('User checked in for the day');
      } catch (error) {
        console.error('Error updating user document:', error.message);
      }
    } else {
      // User already checked in for the day
      console.log('User already checked in for the day');
      alert('User already checked in for the day');
    }
  };
  const handleReports=()=>{

    setReportDialogOpen(true);

  }
  
  const handleCheckOut = async (userData) => {
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '');
  
    if (userData[currentDate] && !userData[currentDate].checkout) {
      // If the user has a field for the current date and not checked out, update it
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', userData.id);
  
      try {
        await updateDoc(userDocRef, {
          [currentDate]: {
            ...userData[currentDate],
            checkout: true,
            checkoutTime: new Date().toLocaleTimeString(), // Add check-in time
          },
        });
  
        // Fetch updated user data
        const updatedUserDoc = await getDoc(userDocRef);
        const updatedUserData = { id: updatedUserDoc.id, ...updatedUserDoc.data() };
  
        // Update the local state with the updated user data
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUserData.id ? updatedUserData : user))
        );
        alert('User checked out for the day');
      } catch (error) {
        console.error('Error updating user document:', error.message);
      }
    } else {
      // User already checked out for the day or not checked in
      console.log('User already checked out for the day or not checked in');
      alert('User already checked out for the day or not checked in');
    }
  };
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportButtonClick = (reportNumber) => {
    // Set the selected report based on the button click
    setSelectedReport(reportNumber);
  };

  // Render the content based on the selected report
  const renderReportContent = () => {
    switch (selectedReport) {
      case 1:
        return <AbsenteesReport userData={allUsers}/>;
      case 2:
        return <AgeCategoryReport userData={allUsers}/>;
      case 3:
        return <Typography>Report3</Typography>;
      case 4:
        return <Typography>Report4</Typography>;
      default:
        return null;
    }
  };

  
  return (
    <Box>
      <AppBar></AppBar>

      <Box
        sx={{
          backgroundColor: '#3f51b5',
          color: '#fff',
          textAlign: 'center',
          padding: '40px',
          marginTop:'60px'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome, Facility Administrator
        </Typography>
        <Typography variant="subtitle1">
          Manage child enrollments, staff hiring, and more.
        </Typography>
      </Box>

      {/* Quick Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <Box>
          <Button variant="outlined" onClick={handleEnroll}>
            Enroll a Child
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleWithdrawComponent}>
            Withdraw a Child
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleHire}>
            Hire a Staff
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleTerminate}>
            Terminate a Staff
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleWithdrawalRequest}>
            Withdrawal Requests
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleClassroom}>
            ClassRoom Update
          </Button>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleReports}>
            Reports
          </Button>
        </Box>
      </Box>
    


      <Dialog open={enrollDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Enroll a Child</DialogTitle>
        <DialogContent>
            <Register/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={withdrawDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Withdraw a Child</DialogTitle>
        <DialogContent>
          <Withdraw/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Hire Dialog */}
      <Dialog open={hireDialogOpen} onClose={handleCloseDialogs}>
        {/* <DialogTitle>Hire a Staff</DialogTitle> */}
        <DialogContent>
          <EnrollTeacher/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Terminate Dialog */}
      <Dialog open={terminateDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Terminate a Staff</DialogTitle>
        <DialogContent>
          <TerminateStaff/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={classroomDialogOpen} onClose={handleCloseDialogs}>
        
        <DialogContent>
          
          <Classroom classrooms={classrooms}/>
          <ClassroomManagement/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClassroomClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={withdrawalrequests} onClose={handleCloseDialogs}>
        <DialogTitle>Withdrawal Requests</DialogTitle>
        <DialogContent>
        <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Email</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {withdrawalUsers.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.email}</TableCell>
            <Button onClick={() => handleWithdraw(user)}>Withdraw</Button>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reportDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="md">
      <DialogTitle>Reports</DialogTitle>
      <DialogContent>
        <Button onClick={() => handleReportButtonClick(1)}>Absentees Report </Button>
        <Button onClick={() => handleReportButtonClick(2)}>Presentees Report</Button>
        

        {/* Render the selected report content */}
        {renderReportContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogs}>Close</Button>
      </DialogActions>
    </Dialog>

      {usersLoaded&&(<Box sx={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd' }}>
      <Typography variant="h5" gutterBottom>
          All Users Details
        </Typography>
        <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Email</TableCell>
        <TableCell>Role</TableCell>
        <TableCell>First Name</TableCell>
        <TableCell>Last Name</TableCell>
        <TableCell>Date of Birth</TableCell>
        <TableCell>Phone Number</TableCell>
        <TableCell>Action</TableCell>
        <TableCell>CheckinTime</TableCell>
        <TableCell>CheckoutTime</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {allUsers.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.role}</TableCell>
          <TableCell>{user.firstName}</TableCell>
          <TableCell>{user.lastName}</TableCell>
          <TableCell>{user.dob}</TableCell>
          <TableCell>{user.phoneNumber}</TableCell>
          <TableCell>
            <Button
                onClick={() => handleCheckin(user)}
                disabled={user[currentDate].checkin} // Disable Checkin if already checked in
            >
                Signin
            </Button>
            <Button
                onClick={() => handleCheckOut(user)}
                disabled={(!user[currentDate].checkin)||user[currentDate].checkout} // Disable Checkout if not checked in
            >
                Signout
            </Button>

            </TableCell>
            <TableCell>{user[currentDate].checkinTime}</TableCell>
            <TableCell>{user[currentDate].checkoutTime}</TableCell>

        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      </Box>)}
    </Box>
  );
};

export default FacilityAdminUI;
