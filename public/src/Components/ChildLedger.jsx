import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../Data/firebase';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ChildLedger = ({ userData }) => {
  const db = getFirestore(app);
  const [ledgerData, setLedgerData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const ledgerCollection = doc(db, 'ledger', userData.email);
        const ledgerSnapshot = await getDoc(ledgerCollection);
        console.log(ledgerSnapshot.data());
        setLedgerData(ledgerSnapshot.data() || {}); // Ensure ledgerData is an object, even if null
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ledger data:', error.message);
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, [db, userData.email]);

  return (
    <div>
      <p>{userData ? `Ledger for ${userData.firstName} ${userData.lastName}` : 'Loading...'}</p>

      {loading ? (
        <p>Loading ledger data...</p>
      ) : Object.keys(ledgerData).length === 0 ? (
        <p>No transaction records.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell>CVV</TableCell>
                <TableCell>Expiration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(ledgerData).map((date) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{ledgerData[date].transactions.amount}</TableCell>
                  <TableCell>{ledgerData[date].transactions.cardDetails.cardNumber}</TableCell>
                  <TableCell>{ledgerData[date].transactions.cardDetails.cvv}</TableCell>
                  <TableCell>{ledgerData[date].transactions.cardDetails.expirationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ChildLedger;
