import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert
} from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../Data/firebase';

const Register = () => {
  const [childInfo, setChildInfo] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    allergies: '',
    email: '',
    password: '',
  });

  const [parentInfo, setParentInfo] = useState({
    parentNames: '',
    phoneNumber: '',
    address: '',
    consentForm: false,
    role: 'parents',
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage]=useState(null);
  const [loading, setLoading] = useState(false);

  const [waitingList, setWaitingList] = useState(false);
  let waitlist=false;
  const capacityLimits = {
    Infant: 8,
    Toddler: 12,
    Twaddler: 16,
    '3Year': 18,
    '4Year': 20,
  };

  const handleEnroll = async () => {
    setLoading(true); // Set loading to true when enrollment process starts
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        childInfo.email,
        childInfo.password
      );
      const user = userCredential.user;

      // Calculate age based on Date of Birth
      const dob = new Date(childInfo.dob);
      const currentDate = new Date();
      const enStartDate = new Date().toLocaleDateString('en-US').replace(/\//g, ''); 
      const age = Math.floor((currentDate - dob) / (1000 * 60 * 60 * 24 * 30.44)); // Approximate months in a year

      let ageCategory = '';
      if (age <= 12) {
        ageCategory = 'Infant';
      } else if (age > 12 && age <= 24) {
        ageCategory = 'Toddler';
      } else if (age > 24 && age <= 36) {
        ageCategory = 'Twaddler';
      } else if (age > 36 && age <= 48) {
        ageCategory = '3Year';
      } else if (age > 48 && age <= 60) {
        ageCategory = '4Year';
      }

      // Increment count in Firestore based on age category
      const countsDocRef = doc(db, 'ageCounts', ageCategory);
      const waitingListDocRef = doc(db, 'waitinglist', ageCategory);
      const countsDoc = await getDoc(countsDocRef);
      console.log('countsDoc exists:', countsDoc.exists());
      let regstatus="null";
      if (countsDoc.exists()) {
        const countsData = countsDoc.data();
        const currentCount = countsData.count || 0;
        console.log('countsData:', countsData);

        if (age >= 0 && age < 12 && currentCount < 8) {
          await setDoc(countsDocRef, { count: currentCount + 1 });
          regstatus="Child Has Been Enrolled...!!";
          
        } else if (age >= 12 && age < 24 && currentCount < 12) {
          await setDoc(countsDocRef, { count: currentCount + 1 });
          regstatus="Child Has Been Enrolled...!!";
        } else if (age >= 24 && age < 36 && currentCount < 16) {
          await setDoc(countsDocRef, { count: currentCount + 1 });
          regstatus="Child Has Been Enrolled...!!";
        } else if (age >= 36 && age < 48 && currentCount < 18) {
          await setDoc(countsDocRef, { count: currentCount + 1 });
          regstatus="Child Has Been Enrolled...!!";
        } else if (age >= 48 && age < 60 && currentCount < 20) {
          await setDoc(countsDocRef, { count: currentCount + 1 });
          regstatus="Child Has Been Enrolled...!!";
        } else {
          // Age group limit exceeded, add child to waiting list
          await setDoc(waitingListDocRef, { userid: user.email });
          setWaitingList(true);
          waitlist=true;
          regstatus="Child has been added to the waiting list...!!";
        }
      } else {
        await setDoc(countsDocRef, { count: 1 });
        regstatus="Child Has Been Enrolled...!!";
      }
      const classroomDocRef = doc(db, 'classrooms', ageCategory);
    const classroomDoc = await getDoc(classroomDocRef);
    const classroomData = classroomDoc.data() || {};
    const enrolledChildrenCount = (classroomData.enrolledChildren || []).length;

    if (enrolledChildrenCount < capacityLimits[ageCategory]) {
      // Enroll the child
      await updateDoc(classroomDocRef, {
        enrolledChildren: arrayUnion(user.email),
      });
    }
    else {
      // Age group limit exceeded, add child to waiting list
      await setDoc(waitingListDocRef, { userid: user.email });
      setWaitingList(true);
      waitlist = true;
      regstatus = "Child has been added to the waiting list...!!";
    }
      // Store additional information in Firestore
      const userDocRef = doc(db, 'users', user.email);
      await setDoc(userDocRef, {
        firstName: childInfo.firstName,
        lastName: childInfo.lastName,
        dob: childInfo.dob,
        allergies: childInfo.allergies,
        parentNames: parentInfo.parentNames,
        phoneNumber: parentInfo.phoneNumber,
        address: parentInfo.address,
        consentForm: parentInfo.consentForm,
        role: parentInfo.role,
        waitingListStatus: waitlist,
        ageCat: ageCategory,
        email:childInfo.email,
        enrollmentStartDate:enStartDate,
      });


      console.log('Enrolling child:', { childInfo, parentInfo, ageCategory });
      alert(regstatus);
      setError(false);
      resetFields();
    } catch (error) {
      setError(true);
      setErrorMessage(error.message.replace('Firebase: ', ''));
      alert(error.message.replace('Firebase: ', ''))
      console.error('Error enrolling child:', error.message);
    } finally {
      setLoading(false); // Set loading to false after enrollment process completes
    }
  };
  const resetFields = () => {
    setChildInfo({
      firstName: '',
      lastName: '',
      dob: '',
      allergies: '',
      email: '',
      password: '',
    });

    setParentInfo({
      parentNames: '',
      phoneNumber: '',
      address: '',
      consentForm: false,
      role: 'parents',
    });
    setWaitingList(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Child Enrollment
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email" // Add email label
          variant="outlined"
          value={childInfo.email}
          onChange={(e) => setChildInfo({ ...childInfo, email: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Password" // Add password label
          variant="outlined"
          type="password"
          value={childInfo.password}
          onChange={(e) => setChildInfo({ ...childInfo, password: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Child First Name"
          variant="outlined"
          value={childInfo.firstName}
          onChange={(e) => setChildInfo({ ...childInfo, firstName: e.target.value })}
        />
        <TextField
          label="Child Last Name"
          variant="outlined"
          value={childInfo.lastName}
          onChange={(e) => setChildInfo({ ...childInfo, lastName: e.target.value })}
        />
        <TextField
          label="Date of Birth"
          variant="outlined"
          type="date"
          value={childInfo.dob}
          onChange={(e) => setChildInfo({ ...childInfo, dob: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Allergies"
          variant="outlined"
          value={childInfo.allergies}
          onChange={(e) => setChildInfo({ ...childInfo, allergies: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Parent Names"
          variant="outlined"
          value={parentInfo.parentNames}
          onChange={(e) => setParentInfo({ ...parentInfo, parentNames: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          value={parentInfo.phoneNumber}
          onChange={(e) => setParentInfo({ ...parentInfo, phoneNumber: e.target.value })}
          sx={{ width: '500px' }}
        />
        <TextField
          label="Address"
          variant="outlined"
          multiline
          rows={3}
          value={parentInfo.address}
          onChange={(e) => setParentInfo({ ...parentInfo, address: e.target.value })}
          sx={{ width: '500px' }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={parentInfo.consentForm}
              onChange={(e) => setParentInfo({ ...parentInfo, consentForm: e.target.checked })}
              color="primary"
            />
          }
          label="Consent Form"
        />
        <Button variant="contained" onClick={handleEnroll} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Child'}
        </Button>
        {
          error&&( <Alert severity="error" sx={{ color: 'red' }}>
          {errorMessage}
        </Alert>)
        }
       
      </Box>
    </Box>
  );
};

export default Register;
