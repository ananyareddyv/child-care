import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const StaffSign = ({userData}) => {
  const [checkInStatus, setCheckInStatus] = useState(false);
  const [checkOut, setCheckOutStatus] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();

  useEffect(() => {
    // Disable buttons by default if the user is checked out
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '');
    console.log(userData)
    const checkStatus=userData[currentDate].checkin;
    console.log(currentDate)
    setIsDisabled(checkStatus);
    setCheckInStatus(checkStatus)
    setCheckOutStatus(userData[currentDate].checkout)
  }, [checkInStatus]);

  const handleSignIn = async () => {
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '');
    const userRef = doc(db, 'users', user.email);

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData[currentDate] && userData[currentDate].checkin) {
          console.log('User already signed in for the day');
          alert('User already signed in for the day');
          return;
        }

        await updateDoc(userRef, {
          [currentDate]: {
            checkin: true,
            checkinTime: new Date().toLocaleTimeString(), // Add check-in time
          },
        });

        console.log('User signed in for the day');
        alert('User signed in for the day');

        setCheckInStatus(true);
      } else {
        console.log('User not found');
        alert('User not found');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleSignOut = async () => {
    const currentDate = new Date().toLocaleDateString('en-US').replace(/\//g, '');
    const userRef = doc(db, 'users', user.email);

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData[currentDate] && userData[currentDate].status === 'Sign Out') {
          console.log('User already signed out for the day');
          alert('User already signed out for the day');
          return;
        }

        await updateDoc(userRef, {
          [currentDate]: {
            ...userData[currentDate],
            checkout: true,
            checkoutTime: new Date().toLocaleTimeString(), // Add check-in time
          },
        });

        console.log('User signed out for the day');
        alert('User signed out for the day');

        setCheckInStatus(false);

      } else {
        console.log('User not found');
        alert('User not found');
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignIn}
        disabled={isDisabled || checkInStatus}
      >
        Sign In
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSignOut}
        disabled={!isDisabled|| checkOut  }
      >
        Sign Out
      </Button>

    </div>
  );
};

export default StaffSign;