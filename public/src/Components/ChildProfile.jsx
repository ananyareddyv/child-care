// ChildProfile.jsx
import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, setDoc } from 'firebase/firestore';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { app } from '../Data/firebase';

const ChildProfile = ({ userData }) => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  console.log(userData)

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      const db = getFirestore(app);
  
      // Assuming `userData.id` is the document ID
      const userDocRef = doc(db, 'users', userData.id);
  
      // Update only the fields that have changed
      await updateDoc(userDocRef, {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        phoneNumber: editedData.phoneNumber, // Updated field
        allergies: editedData.allergies, // Updated field
        address: editedData.address, // Updated field
        parentNames: editedData.parentNames, // Updated field
        // Add more fields as needed
      });
  
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document:', error.message);
    }
  
    // Close the edit modal
    handleEditClose();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleWithdraw = async (email) => {
    try {
      const db = getFirestore(app);
  
      // Assuming `email` is the document ID
      const withdrawalRequestDocRef = doc(db, 'withdrawalrequests', email);

        // Create a new document with the specified ID (email) and set the fields
        await setDoc(withdrawalRequestDocRef, {
        email: email, // Replace with the new email or other fields
        // Add more fields as needed
        });
  
      console.log('Withdrawal request successfully updated!');
    } catch (error) {
      console.error('Error updating withdrawal request:', error.message);
    }
  };

  return (
    <div>
      <h2>Child Profile</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {/* Existing rows */}
            <TableRow>
              <TableCell>
                <strong>Email:</strong>
              </TableCell>
              <TableCell>{editedData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>First Name:</strong>
              </TableCell>
              <TableCell>{editedData.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Last Name:</strong>
              </TableCell>
              <TableCell>{editedData.lastName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Date of Birth:</strong>
              </TableCell>
              <TableCell>{editedData.dob}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Allergies:</strong>
              </TableCell>
              <TableCell>{userData.allergies}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Address:</strong>
              </TableCell>
              <TableCell>{userData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phone Number:</strong>
              </TableCell>
              <TableCell>{userData.phoneNumber}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Edit Profile Button */}
      <Button variant="outlined" onClick={handleEditClick} sx={{ marginTop: 2 }}>
        Edit Profile
      </Button>
      <Button variant="outlined" onClick={() => handleWithdraw(editedData.email)} sx={{ marginTop: 2 }}>
  Withdraw
</Button>

      {/* Edit Profile Modal */}
      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Child Profile</DialogTitle>
        <DialogContent>
          {/* Edit Profile Form */}
          <TextField
            label="First Name"
            name="firstName"
            value={editedData.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editedData.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editedData.email}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Date of Birth"
            name="dob"
            value={editedData.dob}
            fullWidth
            margin="normal"
            disabled
          />
          {/* Add more fields as needed */}

        </DialogContent>
        <DialogActions>
          {/* Close Button */}
          <Button onClick={handleEditClose}>Close</Button>

          {/* Save Changes Button */}
          <Button variant="contained" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChildProfile;
