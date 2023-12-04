import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';

const ClassroomManagement = () => {
  const [classroomAssignDialogOpen, setClassroomAssignDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState({
    Infant: { assignedStaff: [], enrolledChildren: [] },
    Toddler: { assignedStaff: [], enrolledChildren: [] },
    Twaddler: { assignedStaff: [], enrolledChildren: [] },
    '3Years': { assignedStaff: [], enrolledChildren: [] },
    '4Years': { assignedStaff: [], enrolledChildren: [] },
  });

  useEffect(() => {
    fetchTeachers();
    fetchClassroomData();
  }, []);

  const fetchTeachers = async () => {
    const db = getFirestore();
    const teachersCollectionRef = collection(db, 'users');

    try {
      const teachersSnapshot = await getDocs(query(teachersCollectionRef, where('role', '==', 'teacher')));
      const teachersData = teachersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error.message);
    }
  };

  const fetchClassroomData = async () => {
    const db = getFirestore();
    const classroomsCollectionRef = collection(db, 'classrooms');

    try {
      const classroomsSnapshot = await getDocs(classroomsCollectionRef);
      const classroomsData = classroomsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setClassrooms(classroomsData);
    } catch (error) {
      console.error('Error fetching classroom data:', error.message);
    }
  };

  const getUniqueUnassignedTeachers = () => {
    const assignedTeachers = Object.values(classrooms).reduce(
      (acc, classroom) => {
        // Check if assignedStaff is not empty before adding to the accumulator
        if (classroom.assignedStaff.length > 0) {
          return [...acc, ...classroom.assignedStaff];
        }
        return acc;
      },
      []
    );
  
    return teachers.filter((teacher) => !assignedTeachers.includes(teacher.id));
  };
  

  const handleAssignStaff = async () => {
    if (!selectedClassroom || !selectedTeacher) {
      console.log('Please select both a classroom and a teacher');
      return;
    }

    const db = getFirestore();
    const classroomDocRef = doc(db, 'classrooms', selectedClassroom);

    try {
      const assignedStaffArray = Array.isArray(classrooms[selectedClassroom]?.assignedStaff)
        ? classrooms[selectedClassroom].assignedStaff
        : [];

      const childrenCount = classrooms[selectedClassroom]?.enrolledChildren.length || 0;

      let requiredTeachers = 1;
      if (selectedClassroom === 'Infant' && childrenCount > 4) {
        requiredTeachers = 2;
      } else if (selectedClassroom === 'Toddler') {
        requiredTeachers = Math.ceil(childrenCount / 6);
      } else if (selectedClassroom === 'Twaddler') {
        requiredTeachers = Math.ceil(childrenCount / 8);
      } else if (selectedClassroom === '3Years') {
        requiredTeachers = Math.ceil(childrenCount / 9);
      } else if (selectedClassroom === '4Years') {
        requiredTeachers = Math.ceil(childrenCount / 10);
      }

      if (assignedStaffArray.includes(selectedTeacher)) {
        console.log('Teacher is already assigned to this classroom');
        return;
      }

      if (assignedStaffArray.length + 1 > requiredTeachers) {
        console.log('Cannot assign more teachers than required');
        return;
      }

      await updateDoc(classroomDocRef, {
        assignedStaff: [...assignedStaffArray, selectedTeacher],
      });

      setClassrooms((prevClassrooms) => ({
        ...prevClassrooms,
        [selectedClassroom]: {
          ...prevClassrooms[selectedClassroom],
          assignedStaff: [...assignedStaffArray, selectedTeacher],
        },
      }));

      alert('Assignment has been completed');
      setClassroomAssignDialogOpen(false);
    } catch (error) {
      console.error('Error assigning staff to classroom:', error.message);
    }
  };

  const renderClassroomOptions = () => {
    return Object.keys(classrooms).map((classroom) => {
      const classroomData = classrooms[classroom] || {};
      const assignedStaffArray = Array.isArray(classroomData.assignedStaff) ? classroomData.assignedStaff : [];

      const childrenCount = classroomData.enrolledChildren ? classroomData.enrolledChildren.length : 0;

      let requiredTeachers = 1;
      if (classroom === 'Infant' && childrenCount > 4) {
        requiredTeachers = 2;
      } else if (classroom === 'Toddler') {
        requiredTeachers = Math.ceil(childrenCount / 6);
      } else if (classroom === 'Twaddler') {
        requiredTeachers = Math.ceil(childrenCount / 8);
      } else if (classroom === '3Years') {
        requiredTeachers = Math.ceil(childrenCount / 9);
      } else if (classroom === '4Years') {
        requiredTeachers = Math.ceil(childrenCount / 10);
      }

      const availableSlots = requiredTeachers - assignedStaffArray.length;

      return (
        <MenuItem key={classroom} value={classroom} disabled={availableSlots <= 0}>
          {classroom} ({availableSlots} available slots)
        </MenuItem>
      );
    });
  };

  const uniqueUnassignedTeachers = getUniqueUnassignedTeachers();

  return (
    <Box>
      <Button onClick={() => setClassroomAssignDialogOpen(true)}>Assign Staff to Classroom</Button>

      <Dialog open={classroomAssignDialogOpen} onClose={() => setClassroomAssignDialogOpen(false)}>
        <DialogTitle>Assign Staff to Classroom</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Classroom</InputLabel>
            <Select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)}>
              {renderClassroomOptions()}
            </Select>
          </FormControl>

          {uniqueUnassignedTeachers.length === 0 ? (
            <Box mt={2}>
              <Alert severity="warning">
                No available teachers. Hire more teachers.
              </Alert>
            </Box>
          ) : (
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Select Teacher</InputLabel>
              <Select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                {uniqueUnassignedTeachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAssignStaff} disabled={!selectedClassroom || !selectedTeacher}>
            Assign
          </Button>
          <Button onClick={() => setClassroomAssignDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassroomManagement;
