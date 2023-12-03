import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../Data/firebase';

const EnrollTeacher = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hourlySalary, setHourlySalary] = useState('');
  const role='teacher';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create user in Firebase Authentication
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Create user in Firestore database
      const db = getFirestore(app);
      const userRef = doc(db, 'users', email);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        dob,
        address,
        phoneNumber,
        hourlySalary,
        role,
      });

      // Reset the form fields after submission
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setDob('');
      setAddress('');
      setPhoneNumber('');
      setHourlySalary('');

      console.log('Teacher enrolled successfully!');
      alert('Teacher enrolled successfully!');
    } catch (error) {
      console.error('Error enrolling teacher:', error.message);
    }
  };


  return (
    <Container maxWidth="sm">
      <Typography variant="h6">Enroll Teacher</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Date of Birth"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <TextField
          label="Hourly Salary"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={hourlySalary}
          onChange={(e) => setHourlySalary(e.target.value)}
          required
        />
            <Button variant="contained" color="primary" type="submit">
            Enroll Teacher
            </Button>
      </form>
    </Container>
  );
};

export default EnrollTeacher;
