// ClassroomGrid.jsx

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const Classroom = ({ classrooms }) => {
  console.log("sts")
  const renderClassroomItem = (classroom) => (
    <Grid item xs={4} key={classroom}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {classroom}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Teachers Assigned: {classrooms[classroom].assignedStaff?.join(', ') || 'None'}
        </Typography>
        <Typography variant="subtitle1">
          Children Accommodated: {classrooms[classroom].enrolledChildren?.length || 0}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      {Object.keys(classrooms).map(renderClassroomItem)}
    </Grid>
  );
};

export default Classroom;
