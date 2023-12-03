import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { app } from '../Data/firebase';




const PaymentInitiationComponent =  ({ userData }) => {
  const db = getFirestore(app);
  const [ledgerTotal, setLedgerTotal] = useState(null);
  

  useEffect(() => {
    const fetchLedgerTotal = async () => {
      console.log("hi")
      try {
        const ledgerTotalDocRef = doc(db, 'ledger', 'ledger');
        const ledgerTotalDoc = await getDoc(ledgerTotalDocRef);
        console.log(ledgerTotalDoc.data());
        const total=ledgerTotalDoc.data();
        console.log(total.totalAmount);
        if (ledgerTotalDoc.exists()) {
          setLedgerTotal(Number(ledgerTotalDoc.data().totalAmount) || 0);
        } else {
          console.log('Ledger total document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching ledger total:', error.message);
      }
    };

    fetchLedgerTotal();
  }, [db]);
  const calculatePaymentAmount = (userData) => {
    const rates = {
      Infant: 300,
      Toddler: 275,
      Twadler: 250,
      '3Year': 225,
      '4Year': 200,
    };
    const weeklyRate = rates[userData.ageCat] || 0;
    return weeklyRate;
  };

  const [paymentAmount, setPaymentAmount] = useState(calculatePaymentAmount(userData));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getCurrentMondayKey = () => {
    const currentDate = new Date();
    const daysUntilMonday = (currentDate.getDay() + 6) % 7; // Adjusting to get the last Monday
    const mondayDate = new Date(currentDate.getTime() - daysUntilMonday * 24 * 60 * 60 * 1000);

    const month = (mondayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = mondayDate.getDate().toString().padStart(2, '0');
    const year = mondayDate.getFullYear();

    return `${month}${day}${year}`;
  };
  const monday=getCurrentMondayKey();
  const [isPaymentReceived,setIsPaymentRecieved]=useState(userData[monday].isPaymentReceived);

 
  console.log(getCurrentMondayKey())
 
  const updateLedgerInFirebase = async (userId, transactionDetails) => {
    const newAmount=ledgerTotal+transactionDetails.amount;
    console.log(newAmount)
    try {
      const ledgerTotalDocRef = doc(db, 'ledger', 'ledger');
      await setDoc(ledgerTotalDocRef,{
        totalAmount:newAmount,
      });
      const ledgerRef=doc(db,'ledger',userId);
      const enStartDate = new Date().toLocaleDateString('en-US').replace(/\//g, ''); 
      await setDoc(ledgerRef, {
        [enStartDate]: {
          transactions:transactionDetails,
         
        },
      }, { merge: true });

     
      console.log('Ledger updated successfully in Firebase');
    } catch (error) {
      console.error('Error updating ledger and user payment status in Firebase:', error.message);
    }
  };

  
  const getCurrentDateKey = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${month}${day}${year}`;
  };
  
  

  const handlePay = async () => {
    // Simulate payment processing logic (you may customize this)
    const transactionDetails = {
      amount: paymentAmount,
      transactiontype:"debit",
      timestamp: new Date().toISOString(),
      cardDetails: {
        cardNumber: cardNumber.slice(-4), // Store only the last 4 digits for demonstration
        expirationDate,
        cvv,
      },
    };
  
    // Update the ledger collection in Firebase with the transaction details
    await updateLedgerInFirebase(userData.email, transactionDetails);
  
    // Update userData with the transaction details for the current Monday
    const currentMondayKey = getCurrentMondayKey();
    const updatedUserData = {
      ...userData,
      [currentMondayKey]: {
        ...userData[currentMondayKey],
        transactionDetails,
        isPaymentReceived: true,
      },
    };
  
    const userRef = doc(db, 'users', userData.email);
    await setDoc(userRef, updatedUserData, { merge: true });
  
    // Set paymentAmount to 0 after successful payment
    setPaymentAmount(0);
  
    // Close the dialog after payment
    handleCloseDialog();
    setIsPaymentRecieved(true);
  };
  

  return (
    <Container>
      <Typography variant="h5">{`Payment request for ${userData.firstName} ${userData.lastName}`}</Typography>
      {isPaymentReceived ? (
        <Typography variant="h6">Payment received. No further action needed.</Typography>
      ) : (
        <>
          <Typography variant="h6">{`Amount to Pay: $${paymentAmount}`}</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Confirm Payment
          </Button>

          {/* Payment Dialog */}
          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Enter Card Details</DialogTitle>
            <DialogContent>
              <TextField
                label="Card Number"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Expiration Date"
                type="text"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CVV"
                type="text"
                value={cvv}
                onChange={(e) => setCVV(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handlePay}>
                Pay
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default PaymentInitiationComponent;
