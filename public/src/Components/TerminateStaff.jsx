import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Container, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { app } from '../Data/firebase';

const TerminateStaff = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        const teachersData = [];
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          if (userData.role === 'teacher') {
            teachersData.push({ id: userDoc.id, ...userData });
          }
        });

        setTeachers(teachersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error.message);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleTerminate = async (userId) => {
    try {
      const db = getFirestore(app);
      const userRef = doc(db, 'users', userId);
  
      // Assuming you have a field like 'terminated' to mark the termination status
      await updateDoc(userRef, { terminated: true });
  
      // Delete the terminated user from the Firestore collection
      await deleteDoc(userRef);
  
      // Remove the terminated teacher from the state
      setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.id !== userId));
  
      console.log('Teacher terminated and deleted successfully!');
      alert('Teacher terminated and deleted successfully!');
    } catch (error) {
      console.error('Error terminating teacher:', error.message);
    }
  };
  

  return (
    <Container>
      <Typography variant="h4">Terminate Staff</Typography>
      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleTerminate(teacher.id)}>
                      Terminate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default TerminateStaff;
