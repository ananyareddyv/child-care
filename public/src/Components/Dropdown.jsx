import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({ InputData, onSelect, ValidData,Label }) {
  const [selectedData, setSelectedData] = React.useState('');
  const [hasSelectedData, setHasSelectedData] = React.useState(false);
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedData(selectedValue);
    onSelect(selectedValue);
    setHasSelectedData(true);
    ValidData(selectedValue !== '');
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 500 }} style={{ marginBottom: '10px' }} error={!hasSelectedData}>
        <InputLabel id="demo-simple-select-helper-label">{Label}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedData}
          label={Label}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {InputData.map((row, index) => (
            <MenuItem key={index} value={row}>
              {row}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
