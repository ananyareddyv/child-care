import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Typography, TextField } from '@mui/material';

const StaffAttendance = ({ userData, role }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [date, setDate] = useState(false);
  useEffect(() => {
    var date = moment().format('MMDDYYYY');
    const formattedDate = date.length === 7 ? `${date.slice(0, 2)}0${date.slice(2)}` : date;
    console.log(formattedDate);
    setSelectedDate(date); 
  }, []);

  const handleDateChange = (event) => {
    const originalDate = event.target.value;
    console.log("Original Date:", originalDate);
    
    // Parse the original date
    const parts = originalDate.split("-");
    const year = parts[0];
    let month = parts[1];
    let day = parts[2];
    console.log(day)
    
    // Remove leading zero from the third position if it exists
    day = day.replace(/^0/, '');
    
    // Create the new formatted date in "mmddyyyy" format
    const newDate = month + day + year;
    console.log("Formatted Date:", newDate);
    
    setDate(event.target.value)
    setSelectedDate(newDate);
    setDateSelected(true);
  };

  console.log(userData)

  return (
    <Box>
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        fullWidth
      />


      {selectedDate && userData.some((user) => user[selectedDate]) ? (
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Checkin Time</TableCell>
              <TableCell>Checkout Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => {
              const userDateData = user[selectedDate];
             

              if (userDateData) {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{userDateData.checkinTime || 'N/A'}</TableCell>
                    <TableCell>{userDateData.checkoutTime || 'N/A'}</TableCell>
                  </TableRow>
                );
              }

              return null; // If no data for the selected date, skip this user
            })}
          </TableBody>
        </Table>
      ) : (
       role==="teacher"? <Typography className="no-staff-message">No staff were present</Typography>:<Typography className="no-staff-message">No students were present</Typography>
      )}
    </Box>
  );
};

export default StaffAttendance;
