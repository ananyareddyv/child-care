import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDoc, doc } from 'firebase/firestore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const StaffLedger = ({ user }) => {
  const [userLedger, setUserLedger] = useState({});

  useEffect(() => {
    const fetchUserLedger = async () => {
      const db = getFirestore();
      const userLedgerRef = doc(db, 'ledger', user);

      try {
        const userLedgerSnapshot = await getDoc(userLedgerRef);

        if (userLedgerSnapshot.exists()) {
          setUserLedger(userLedgerSnapshot.data());
          console.log(userLedgerSnapshot.data());
        } else {
          console.error('User ledger document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user ledger data:', error.message);
      }
    };

    fetchUserLedger();
  }, [user]);


  return (

      <div style={{ marginTop: '20px' }}>
        <div className='d-flex justify-content-between'>
       <Typography>Transactions </Typography>
       <Typography>Total Amount Withdrawn : {userLedger.totalAmount}</Typography>
       </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userLedger.transactions &&
                userLedger.transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date.toDate().toLocaleString()}</TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
 
  );
};

export default StaffLedger;
