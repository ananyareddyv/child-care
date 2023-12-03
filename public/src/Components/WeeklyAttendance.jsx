import React from 'react';
import moment from 'moment';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const WeeklyAttendance = ({ userData }) => {
  // Function to calculate weekly attendance
  const calculateWeeklyAttendance = () => {
    const weeklyAttendance = {};

    for (const date in userData) {
      if (typeof userData[date] === 'object' && date !== 'id') {
        const checkinStatus = userData[date].checkin ? 'Checked In' : 'Not Checked In';
        const checkoutStatus = userData[date].checkout ? 'Checked Out' : 'Not Checked Out';

        // Check the length of the date and add '0' in the 3rd position if the length is 7
        const formattedDate = date.length === 7 ? `${date.slice(0, 2)}0${date.slice(2)}` : date;

        const day = moment(formattedDate, 'MMDDYYYY').format('dddd'); // Specify the input format

        if (!weeklyAttendance[day]) {
          weeklyAttendance[day] = [];
        }

        weeklyAttendance[day].push({
          date: moment(formattedDate, 'MMDDYYYY').format('MM/DD/YYYY'), // Specify the input format
          checkinTime: userData[date].checkinTime,
          checkoutTime: userData[date].checkoutTime,
          checkinStatus: checkinStatus,
          checkoutStatus: checkoutStatus,
        });
      }
    }

    return weeklyAttendance;
  };

  // Display weekly table view
  const weeklyAttendance = calculateWeeklyAttendance();

  return (
    <Paper style={{ marginTop: '20px' }}>
      <h2>Weekly Attendance</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Check-in Time</TableCell>
            <TableCell>Check-out Time</TableCell>
            <TableCell>Check-in Status</TableCell>
            <TableCell>Check-out Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(weeklyAttendance).map(day => (
            <React.Fragment key={day}>
              {weeklyAttendance[day].map(entry => (
                <TableRow key={entry.date}>
                  <TableCell>{day}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.checkinTime}</TableCell>
                  <TableCell>{entry.checkoutTime}</TableCell>
                  <TableCell>{entry.checkinStatus}</TableCell>
                  <TableCell>{entry.checkoutStatus}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default WeeklyAttendance;
