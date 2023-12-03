import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import { Switch } from '@mui/material';
import { Button } from '@mui/material';


const WeeklyCalendar = ({
    userData,
    selectedMonth,
    selectedYear,
    currentWeek,
    handlePrevWeek,
    handleNextWeek,
    handleToggleView,
  }) => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const startDay = (currentWeek - 1) * 7 - firstDayOfMonth + 1;
    const endDay = startDay + 6 > daysInMonth ? daysInMonth : startDay + 6;
  
    const createCalendar = () => {
      const row = [];
  
      for (let dayCounter = startDay; dayCounter <= endDay; dayCounter++) {
        if (dayCounter > 0) {
          const date = `${selectedMonth.toString().padStart(2, '0')}${dayCounter.toString().padStart(2, '0')}${selectedYear}`;
          const isWeekend = (firstDayOfMonth + dayCounter - 1) % 7 === 0 || (firstDayOfMonth + dayCounter - 1) % 7 === 6;
          row.push({ day: dayCounter, date, isWeekend });
        } else {
          row.push({ day: '', date: '', isWeekend: false });
        }
      }
  
      return row;
    };
  
    const calendarData = createCalendar();
  
    return (
      <TableRow>
        {calendarData.map((cell, columnIndex) => (
          <TableCell
            key={columnIndex}
            style={{
              backgroundColor: cell.day !== '' ? (userData[cell.date] && !cell.isWeekend ? '#2fbc2f' : (cell.isWeekend ? 'transparent' : 'red')) : 'transparent',
            }}
          >
            {cell.day !== '' && (
              <Tooltip title={userData[cell.date] ? JSON.stringify(userData[cell.date]) : ''}>
                <span>{cell.day}</span>
              </Tooltip>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  };
  

const Calendar = ({ userData }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, [currentMonth, currentYear]);

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === 'monthly' ? 'weekly' : 'monthly'));
    setCurrentWeek(1); // Reset current week when toggling between monthly and weekly
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => Math.max(prevWeek - 1, 1));
  };

  const handleNextWeek = () => {
    const weeksInMonth = Math.ceil((new Date(selectedYear, selectedMonth, 0).getDate() + new Date(selectedYear, selectedMonth - 1, 1).getDay() - 1) / 7);
    setCurrentWeek((prevWeek) => Math.min(prevWeek + 1, weeksInMonth));
  };

  const createCalendar = () => {
    const calendar = [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const weeksInMonth = Math.ceil((daysInMonth + firstDayOfMonth - 1) / 7);

    for (let i = 0; i < weeksInMonth; i++) {
      const row = [];

      for (let j = 0; j < 7; j++) {
        const dayCounter = i * 7 + j + 1 - firstDayOfMonth;
        const date = `${selectedMonth.toString().padStart(2, '0')}${dayCounter.toString().padStart(2, '0')}${selectedYear}`;
        const isWeekend = j === 0 || j === 6; // Sunday or Saturday
        row.push({ day: dayCounter > 0 && dayCounter <= daysInMonth ? dayCounter : '', date, isWeekend });
      }

      calendar.push(row);
    }

    return calendar;
  };

  const calendarData = createCalendar();

  return (
    <Box>
      <Select label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        {months.map((m) => (
          <MenuItem key={m} value={m}>
            {new Date(selectedYear, m - 1, 1).toLocaleString('default', { month: 'long' })}
          </MenuItem>
        ))}
      </Select>

      <Select label="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>

      <Switch onChange={handleToggleView} />

      {viewMode === 'weekly' && (
        <>
          <Button onClick={handlePrevWeek}>Previous Week</Button>
          <Button onClick={handleNextWeek}>Next Week</Button>
        </>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sun</TableCell>
            <TableCell>Mon</TableCell>
            <TableCell>Tue</TableCell>
            <TableCell>Wed</TableCell>
            <TableCell>Thu</TableCell>
            <TableCell>Fri</TableCell>
            <TableCell>Sat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viewMode === 'weekly' ? (
            <WeeklyCalendar
              userData={userData}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              currentWeek={currentWeek}
              handlePrevWeek={handlePrevWeek}
              handleNextWeek={handleNextWeek}
              handleToggleView={handleToggleView}
            />
          ) : (
            calendarData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    style={{
                      backgroundColor: cell.day !== '' ? (userData[cell.date] && !cell.isWeekend ? '#2fbc2f' : (cell.isWeekend ? 'transparent' : 'red')) : 'transparent',
                    }}
                  >
                    {cell.day !== '' && (
                      <Tooltip title={userData[cell.date] ? JSON.stringify(userData[cell.date]) : ''}>
                        <span>{cell.day}</span>
                      </Tooltip>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Calendar;
