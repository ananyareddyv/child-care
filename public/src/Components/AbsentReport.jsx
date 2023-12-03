import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const AbsenteesReport = ({ userData }) => {
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
  const [absenteesData, setAbsenteesData] = useState([]);

  useEffect(() => {
   
    const absentees = userData.filter(user => 
        !user[selectedDate] && user.role !== 'SA' && user.role !== 'FA'
      );
      
    setAbsenteesData(absentees);
  }, [userData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
	  const originalDate = selectedDate
    
    // Parse the original date
    const parts = originalDate.split("-");
    const year = parts[0];
    let month = parts[1];
    let day = parts[2];
    console.log(day)
    day = day.replace(/^0/, '');

    const newDate = month + day + year;
    const absentees = userData.filter(user => 
        !user[newDate] && user.role !== 'SA' && user.role !== 'FA'
      );
      console.log(absentees)
      setAbsenteesData(absentees)
      

  };

  return (
    <div>
      <h2>Absentees Report</h2>
      {/* Material-UI TextField */}
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
        <p>No absentees on {selectedDate}</p>
      )}
    </div>
  );
};

export default AbsenteesReport;