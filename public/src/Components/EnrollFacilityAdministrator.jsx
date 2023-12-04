import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from '../Data/firebase';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const EnrollFacilityAdministrator = () => {
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [admincontact, setAdminContact] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    return (
      facilityName.trim() !== '' &&
      address.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      adminEmail.trim() !== '' &&
      password.trim() !== '' &&
      licenseNumber.trim() !== ''
    );
  };

  const handleEnroll = async () => {
    // Validate inputs here if needed

    if (!isFormValid()) {
      alert('Please fill in all fields.');
      return;
    }

    const db = getFirestore(app);
    const auth = getAuth(app);

    // Create a new document in the "users" collection with the email as the document ID
    const emailId = adminEmail.toLowerCase();
    const userDocRef = doc(db, 'users', emailId);
    const { user } = await createUserWithEmailAndPassword(auth, adminEmail, password);


    const userData = {
      role: 'FA',
      facilityName,
      address,
      phoneNumber,
      email: adminEmail,
      licenseNumber,
      admincontact,
    };

    try {
      setLoading(true);
      await setDoc(userDocRef, userData);
      resetForm(); 
      alert('Facility Administrator enrolled successfully!');
    } catch (error) {
      console.error('Error enrolling Facility Administrator:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFacilityName('');
    setAddress('');
    setPhoneNumber('');
    setAdminEmail('');
    setPassword('');
    setLicenseNumber('');
    setAdminContact('');
  };


  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Enroll Facility Administrator
      </Typography>
      <TextField
        label="Name of the facility"
        value={facilityName}
        onChange={(e) => setFacilityName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <br/>
      <TextField
        label="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Admin Email"
        type="email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <br/>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="License Number"
        value={licenseNumber}
        onChange={(e) => setLicenseNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <br/>
      <TextField
        label="Admin Contact"
        value={admincontact}
        onChange={(e) => setAdminContact(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <br/>
      <Button
        variant="contained"
        onClick={handleEnroll}
        sx={{ mt: 2 }}
        disabled={!isFormValid() || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Enroll Facility Administrator'}
      </Button>
    </Box>
  );
};

export default EnrollFacilityAdministrator;
