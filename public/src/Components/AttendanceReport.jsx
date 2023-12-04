import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';

const AgeCategoryReport = ({ userData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showData, setShowData] = useState(false);
  const [absenteesData, setAbsenteesData] = useState([]); // Use state to store parent users

  useEffect(() => {
    const presentUsers = userData.filter(user => 
      user[selectedDate] && user.role !== 'SA' && user.role !== 'FA'
    );

    // Update parentUsersList with presentUsers
    setAbsenteesData(presentUsers);
  }, [userData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    const originalDate = event.target.value;
  
    // Parse the original date
    const parts = originalDate.split("-");
    const year = parts[0];
    let month = parts[1];
    let day = parts[2];
    day = day.replace(/^0/, '');

    const newDate = month + day + year;
    const usersWithNewDate = userData.filter(user => user[newDate] !== undefined);

    // Update parentUsersList with usersWithNewDate
    setAbsenteesData(usersWithNewDate);

    // Set showData to true
    setShowData(true);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Present Users Report
      </Typography>
      <TextField
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
        variant="outlined"
        fullWidth
        label="Select Date"
        InputLabelProps={{ shrink: true }}
      />

{absenteesData.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: '16px' }}>
          {/* Material-UI Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Parent Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {absenteesData.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{selectedDate}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.parentNames?user.parentNames:"Staff"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No Presentes on {selectedDate}</p>
      )}
    </div>
  );
};

export default AgeCategoryReport;
