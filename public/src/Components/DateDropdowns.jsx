import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const DateDropdowns = ({ onDateChange }) => {
  // Create arrays for months and years
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

  // State to hold selected values
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Update parent component with selected dates
  const handleDateChange = () => {
    onDateChange({
      month: selectedMonth,
      year: selectedYear,
    });
  };

  return (
    <Box>
      <Select label="Month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} onBlur={handleDateChange}>
        {months.map((m) => (
          <MenuItem key={m} value={m}>
            {new Date(selectedYear, m - 1, 1).toLocaleString('default', { month: 'long' })}
          </MenuItem>
        ))}
      </Select>

      <Select label="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} onBlur={handleDateChange}>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DateDropdowns;
