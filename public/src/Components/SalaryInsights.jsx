import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getAuth } from 'firebase/auth';
import { app } from '../Data/firebase';
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { CircularProgress } from '@mui/material';

const SalaryInsights = ({ userData }) => {
  const [weeklySalary, setWeeklySalary] = useState(0);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [isSalaryWithdrawn, setSalaryWithdrawn] = useState(false); // State to manage loading state



  useEffect(() => {
    calculateWeeklySalary();
  }, []); // Run the calculation once when the component mounts

  const calculateTimeDifference = (checkinTime, checkoutTime) => {
    const checkinDateTime = new Date(`01/01/2001 ${checkinTime}`);
    const checkoutDateTime = new Date(`01/01/2001 ${checkoutTime}`);

    const timeDiffMilliseconds = checkoutDateTime - checkinDateTime;
    const hoursDifference = timeDiffMilliseconds / (1000 * 60 * 60);

    return hoursDifference;
  };

  const calculateWeeklySalary = async () => {
    const hourlyRate = parseFloat(userData.hourlySalary);
    const currentDate = new Date();
    const lastMonday = new Date();
    lastMonday.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
  
    let totalHoursWorked = 0;
    const datesArray = [];
  
    // Create an array of objects with dates from last Monday to today (excluding Sat and Sun)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(lastMonday);
      currentDate.setDate(lastMonday.getDate() + i);
  
      // Exclude Saturdays (day 6) and Sundays (day 0)
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        const formattedDate = currentDate.toLocaleDateString('en-US').replace(/\//g, '');
  
        if (userData[formattedDate]) {
          datesArray.push({
            [formattedDate]: userData[formattedDate],
          });
        }
      }
    }
  
    for (let i = 0; i < datesArray.length; i++) {
      const curDateData = Object.values(datesArray[i]);
      const checkinTime = curDateData[0].checkinTime;
      const checkoutTime = curDateData[0].checkoutTime;
  
      const hoursDifference = calculateTimeDifference(checkinTime, checkoutTime);
      totalHoursWorked += hoursDifference;
    }
  
    console.log('Total Hours Worked:', totalHoursWorked);
    const weeklySalary = totalHoursWorked * hourlyRate;
    console.log('Weekly Salary:', weeklySalary);
  
    // Set the weekly salary to the state
    setWeeklySalary(weeklySalary);
  
    // Check if the salary has been withdrawn for the previous week
    const isSalaryWithdrawn = await checkSalaryWithdrawnForPreviousWeek(lastMonday, currentDate);
    setSalaryWithdrawn(isSalaryWithdrawn);
  };
  
  const checkSalaryWithdrawnForPreviousWeek = async (startDate, endDate) => {
    const db = getFirestore(app);
    const ledgerDocRef = doc(db, 'ledger', userData.email);
  
    try {
      const ledgerDocSnapshot = await getDoc(ledgerDocRef);
  
      if (ledgerDocSnapshot.exists()) {
        const currentLedgerData = ledgerDocSnapshot.data();
        const transactions = currentLedgerData.transactions || [];
  
        // Check if there are withdrawal transactions for the previous week
        const isWithdrawnForPreviousWeek = transactions.some(transaction => {
          const transactionDate = new Date(transaction.date.toDate());
          return transactionDate >= startDate && transactionDate <= endDate && transaction.transactionType === 'withdraw';
        });
  
        return isWithdrawnForPreviousWeek;
      }
    } catch (error) {
      console.error('Error checking salary withdrawal:', error.message);
    }
  
    return false;
  };
  

  const withdrawSalary = async () => {
    // Check if the salary is greater than 0
    if (weeklySalary > 0) {
      // Start loading
      setLoading(true);

      // Update user ledger in Firestore
      const auth = getAuth(app);
      const db = getFirestore(app);
      const ledgerDocRef = doc(db, 'ledger', userData.email);

      try {
        // Get the current ledger data
        const ledgerDocSnapshot = await getDoc(ledgerDocRef);

        if (ledgerDocSnapshot.exists()) {
          const currentLedgerData = ledgerDocSnapshot.data();
          const totalAmount = currentLedgerData.totalAmount || 0;

          // Update the total amount in the ledger
          await updateDoc(ledgerDocRef, {
            totalAmount: totalAmount + weeklySalary,
            // Add withdrawal transaction to the transactions array
            transactions: [
              ...(currentLedgerData.transactions || []), // Keep existing transactions
              {
                amount: weeklySalary,
                date: new Date(),
                transactionType: "withdraw",
              },
            ],
          });
        } else {
          // If the ledger document does not exist, create a new one
          await setDoc(ledgerDocRef, {
            totalAmount: weeklySalary,
            
            transactions: [
              {
                amount: weeklySalary,
                date: new Date(),
                transactionType: "withdraw",
              },
            ],
          });
        }

        // Stop loading
        setLoading(false);

        // Subtract the withdrawn amount from the weekly salary
        setWeeklySalary(0);
      } catch (error) {
        console.error('Error updating ledger:', error.message);
        // Stop loading in case of an error
        setLoading(false);
      }
    }
  };
  
  


  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Typography variant="body1" paragraph>
          {isSalaryWithdrawn
            ? 'Salary has already been credited.'
            : 'Your weekly salary based on the recorded attendance:'}
        </Typography>

        {!isSalaryWithdrawn && (
          <Typography variant="body2" mt={2}>
            Weekly Salary: ${weeklySalary.toFixed(2)}
          </Typography>
        )}

        {!isSalaryWithdrawn && (weeklySalary > 0 && !loading) && (
          <Button variant="contained" color="primary" onClick={withdrawSalary}>
            Withdraw Salary
          </Button>
        )}

        {loading && (
          <CircularProgress color="primary" style={{ marginTop: '20px' }} />
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryInsights;