import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  FieldValue,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { app } from '../Data/firebase';

const Withdraw = () => {
  const [parentList, setParentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false); // State to manage withdrawal loading

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const usersCollectionRef = collection(db, 'users');

      try {
        const querySnapshot = await getDocs(usersCollectionRef);

        // Extract data from the query snapshot
        const parents = querySnapshot.docs
          .filter((doc) => doc.data().role === 'parents')
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setParentList(parents);
      } catch (error) {
        console.error('Error fetching parent data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async (parent) => {
    const db = getFirestore(app);
    const auth = getAuth(app);
  
    try {
      setWithdrawLoading(true); // Start withdrawal loading
  
      // Delete the user document from the "users" collection
      const userDocRef = doc(db, 'users', parent.id);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        // Get the classroom ID from the user document
        const classroomId = parent.ageCat;
        console.log(classroomId);
  
        // Remove the withdrawn user from the parentList
        setParentList((prevParentList) =>
          prevParentList.filter((p) => p.id !== parent.id)
        );
  
        // Delete the user document
        await deleteDoc(userDocRef);
  
        // Decrement count in Firestore based on age category
        const countsDocRef = doc(db, 'ageCounts', parent.ageCat);
        const countsDoc = await getDoc(countsDocRef);
  
        if (countsDoc.exists()) {
          const currentCount = countsDoc.data().count || 0;
          await setDoc(countsDocRef, { count: Math.max(currentCount - 1, 0) });
        }
  
        alert('User has been successfully withdrawn');
  
        console.log(`Withdraw user with ID: ${parent.id}`);
  
        // If the user was assigned to a classroom, remove the user from the classroom
        if (classroomId) {
          const classroomRef = doc(db, 'classrooms', classroomId);
          const classroomDoc = await getDoc(classroomRef);

          if (classroomDoc.exists()) {
            const data = classroomDoc.data();
            
            // Modify the data as needed, for example, remove the email from enrolledChildren array
            const updatedEnrolledChildren = data.enrolledChildren.filter(email => email !== parent.email);

            // Update the document with the modified data
            await updateDoc(classroomRef, {
              enrolledChildren: updatedEnrolledChildren,
            });
          }

        }
      }
    } catch (error) {
      console.error('Error withdrawing user:', error.message);
    } finally {
      setWithdrawLoading(false); // Stop withdrawal loading
    }
  };
  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h4>List of Users</h4>
      <TableContainer component={Paper} sx={{ width: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Waiting List Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parentList.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell>{parent.firstName}</TableCell>
                <TableCell>{parent.lastName}</TableCell>
                <TableCell>{parent.waitingListStatus ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleWithdraw(parent)}
                    disabled={withdrawLoading} // Disable the button during withdrawal
                  >
                    {withdrawLoading ? <CircularProgress size={20} /> : 'Withdraw'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Withdraw;
