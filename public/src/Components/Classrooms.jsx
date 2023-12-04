// ClassroomGrid.jsx

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const ClassroomGrid = ({ classrooms }) => {
  const capacityLimits = {
    Infant: 8,
    Toddler: 12,
    Twaddler: 16,
    '3Year': 18,
    '4Year': 20,
  };

  const feeDetails = {
    Infant: '$300/wk',
    Toddler: '$275/wk',
    Twaddler: '$250/wk',
    '3Year': '$225/wk',
    '4Year': '$200/wk',
  };

  const renderClassroomItem = (classroom) => {
    const assignedStaff = classrooms[classroom]?.assignedStaff || [];
    const enrolledChildren = classrooms[classroom]?.enrolledChildren || [];

    // Get the capacity for the current classroom based on its age group
    const capacityLimit = capacityLimits[classroom] || 0;
    const availableSlots = Math.max(0, capacityLimit - enrolledChildren.length);

    // Get the fee for the current classroom based on its age group
    const fee = feeDetails[classroom] || 'Not specified';

    return (
      <Grid item xs={6} key={classroom}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            {classroom}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Teachers Assigned: {assignedStaff.length > 0 ? assignedStaff.join(', ') : 'None'}
          </Typography>
          <Typography variant="subtitle1">
            Children Accommodated: {enrolledChildren.length} / {capacityLimit}
          </Typography>
          <Typography variant="subtitle1">
            Available Slots: {availableSlots}
          </Typography>
          <Typography variant="subtitle1">
            Fee: {fee}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  return (
    <Grid container xs={12} spacing={3}>
      {Object.keys(classrooms).map(renderClassroomItem)}
    </Grid>
  );
};

export default ClassroomGrid;
