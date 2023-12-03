import React, { useState } from 'react';
import Calendar from './Calander';

const Attendance = ({ userData }) => {






  return (
    <div>
      <p>{userData ? `Attendance for ${userData.firstName} ${userData.lastName}` : 'Loading...'}</p>
      <Calendar userData={userData}/>
    </div>
  );
};

export default Attendance;
